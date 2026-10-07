const { predictComplaint } = require("./complaintClassifier");

const CATEGORIES = [
  "Garbage & Waste Management",
  "Road Damage / Potholes",
  "Street Light",
  "Drainage & Sewerage",
  "Water Supply",
  "Other",
];

const PRIORITIES = ["Critical", "High", "Medium", "Low"];

const departmentMap = {
  "Garbage & Waste Management": "Sanitation Department",
  "Road Damage / Potholes": "Road Department",
  "Street Light": "Electrical Department",
  "Drainage & Sewerage": "Drainage Department",
  "Water Supply": "Water Department",
  Other: "General Civic Department",
};

const analyzeComplaint = (description) => {
  const prediction = predictComplaint(description);
  const { category, priority } = prediction;

  if (!CATEGORIES.includes(category.label) || !PRIORITIES.includes(priority.label)) {
    throw new Error("Complaint classifier returned an invalid prediction");
  }

  return {
    category: category.label,
    categoryConfidence: category.confidence,
    department: departmentMap[category.label],
    priority: priority.label,
    priorityConfidence: priority.confidence,
  };
};

const normalize = (value) =>
  (value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "been",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "near",
  "of",
  "on",
  "the",
  "there",
  "to",
  "was",
  "were",
  "with",
]);

const getTerms = (value) => {
  const tokens = normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  const terms = [...tokens];

  for (let index = 0; index < tokens.length - 1; index += 1) {
    terms.push(`${tokens[index]}_${tokens[index + 1]}`);
  }

  return terms;
};

const getTermWeights = (documents) => {
  const termFrequency = documents.map((document) => {
    const counts = new Map();
    getTerms(document).forEach((term) => {
      counts.set(term, (counts.get(term) || 0) + 1);
    });
    return counts;
  });
  const documentFrequency = new Map();

  termFrequency.forEach((counts) => {
    counts.forEach((_count, term) => {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    });
  });

  return termFrequency.map((counts) => {
    const weights = new Map();
    counts.forEach((count, term) => {
      const inverseDocumentFrequency =
        Math.log(1 + documents.length / (1 + documentFrequency.get(term))) + 1;
      weights.set(term, count * inverseDocumentFrequency);
    });
    return weights;
  });
};

const cosineSimilarity = (first, second) => {
  let dotProduct = 0;
  let firstMagnitude = 0;
  let secondMagnitude = 0;

  first.forEach((weight, term) => {
    firstMagnitude += weight ** 2;
    dotProduct += weight * (second.get(term) || 0);
  });
  second.forEach((weight) => {
    secondMagnitude += weight ** 2;
  });

  if (!firstMagnitude || !secondMagnitude) {
    return 0;
  }

  return dotProduct / Math.sqrt(firstMagnitude * secondMagnitude);
};

const getLocationSimilarity = (first, second) => {
  const firstTokens = new Set(getTerms(first));
  const secondTokens = new Set(getTerms(second));
  if (!firstTokens.size || !secondTokens.size) {
    return 0;
  }

  const intersectionSize = [...firstTokens].filter((token) =>
    secondTokens.has(token)
  ).length;
  const unionSize = new Set([...firstTokens, ...secondTokens]).size;
  const similarity = intersectionSize / unionSize;

  return similarity >= 0.45 ? 0.4 + similarity * 0.6 : 0;
};

const hasCoordinates = (latitude, longitude) =>
  latitude !== null &&
  latitude !== undefined &&
  latitude !== "" &&
  longitude !== null &&
  longitude !== undefined &&
  longitude !== "" &&
  Number.isFinite(Number(latitude)) &&
  Number.isFinite(Number(longitude));

const getDistanceInMeters = (first, second) => {
  const latitudeDifference = ((second.latitude - first.latitude) * Math.PI) / 180;
  const longitudeDifference =
    ((second.longitude - first.longitude) * Math.PI) / 180;
  const firstLatitude = (first.latitude * Math.PI) / 180;
  const secondLatitude = (second.latitude * Math.PI) / 180;
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(firstLatitude) *
      Math.cos(secondLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 6371000 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

const findDuplicateMatches = (complaint, existingComplaints) => {
  const candidates = existingComplaints.filter(
    (existing) =>
      existing.category === complaint.category &&
      (!complaint.department || existing.department === complaint.department)
  );
  const vectors = getTermWeights([
    complaint.description,
    ...candidates.map((candidate) => candidate.description),
  ]);
  const complaintVector = vectors[0];

  return candidates
    .map((candidate, index) => {
      const textSimilarity = cosineSimilarity(
        complaintVector,
        vectors[index + 1]
      );
      const hasNearbyCoordinates =
        hasCoordinates(complaint.latitude, complaint.longitude) &&
        hasCoordinates(candidate.latitude, candidate.longitude) &&
        getDistanceInMeters(
          {
            latitude: Number(complaint.latitude),
            longitude: Number(complaint.longitude),
          },
          {
            latitude: Number(candidate.latitude),
            longitude: Number(candidate.longitude),
          }
        ) <= 300;
      const locationSimilarity = hasNearbyCoordinates
        ? 1
        : getLocationSimilarity(complaint.location, candidate.location);

      if (textSimilarity < 0.12 || locationSimilarity === 0) {
        return null;
      }

      const similarity =
        textSimilarity * 0.7 + locationSimilarity * 0.3;
      if (similarity < 0.4) {
        return null;
      }

      return {
        id: candidate.id,
        duplicateGroupId: candidate.duplicate_group_id || candidate.id,
        title: candidate.title,
        description: candidate.description,
        category: candidate.category,
        location: candidate.location,
        status: candidate.status || "Pending",
        similarity: Number(similarity.toFixed(3)),
      };
    })
    .filter(Boolean)
    .sort((first, second) => second.similarity - first.similarity);
};

const createDuplicateGroupLabel = (category, location) =>
  `${category} issue near ${location.trim()}`;

module.exports = {
  analyzeComplaint,
  createDuplicateGroupLabel,
  departmentMap,
  findDuplicateMatches,
};
