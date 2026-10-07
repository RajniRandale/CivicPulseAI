const CATEGORY_EXAMPLES = {
  "Garbage & Waste Management": [
    "Garbage has not been collected near APSIT",
    "There is garbage accumulated near the college",
    "Waste bins are overflowing on the street",
    "Rubbish and litter have been dumped in the public area",
    "The municipal garbage truck skipped our neighborhood",
    "Dead animals and waste need to be removed from the road",
    "Garbage has been lying outside the building for several days",
    "The community dustbin is full and waste is scattered",
    "Please arrange door to door waste collection",
    "A pile of household trash is blocking the footpath",
    "Uncollected garbage is causing a bad smell in the market",
    "The public litter bin has not been emptied",
  ],
  "Road Damage / Potholes": [
    "Road near APSIT has many potholes",
    "A deep pothole is damaging vehicles on the road",
    "The road surface is broken and cracked",
    "A large hole has formed in the street after the rain",
    "The footpath pavement is damaged and unsafe",
    "The main road needs resurfacing",
    "Several potholes are causing traffic problems",
    "A broken manhole cover is in the middle of the road",
    "The asphalt has collapsed near the junction",
    "The sidewalk tiles are loose and broken",
    "Road construction left a dangerous uneven surface",
    "There is a crack across the public road",
  ],
  "Street Light": [
    "Street light is not working on our lane",
    "The street lamp has been off for several nights",
    "A public light pole needs a replacement bulb",
    "There is no lighting on the road after dark",
    "The streetlight keeps switching off",
    "The electric lamp in the park is broken",
    "A street light is flickering outside the building",
    "The road is dark because the public lights are out",
    "Please repair the lamp post near the bus stop",
    "One lane has no working street illumination",
    "A broken outdoor light makes the footpath unsafe",
    "The street lighting cable is damaged",
  ],
  "Drainage & Sewerage": [
    "Drainage water is overflowing near the houses",
    "The sewer is blocked and wastewater is backing up",
    "A roadside drain is clogged with dirty water",
    "Sewage is leaking from the manhole",
    "The storm water drain is overflowing onto the road",
    "Wastewater is flooding the street",
    "Please clear the blocked drainage pipe",
    "The open gutter smells and needs cleaning",
    "A sewer cover is broken and the drain is exposed",
    "Rainwater cannot flow because the drain is blocked",
    "Dirty drainage water is entering the homes",
    "The public manhole is overflowing",
  ],
  "Water Supply": [
    "Water is not available in our building",
    "There has been no water supply since morning",
    "A water pipe is leaking on the street",
    "The tap water has low pressure",
    "The public water line is broken",
    "Drinking water is contaminated and unsafe",
    "The water tanker did not arrive",
    "The neighborhood has a water shortage",
    "A burst water pipe is flooding the road",
    "The municipal water connection is dry",
    "The water supply is irregular in our area",
    "Please repair the leaking water pipeline",
  ],
  Other: [
    "Please remove a fallen tree from the public area",
    "A stray animal needs municipal assistance",
    "There is an abandoned vehicle on the street",
    "Please inspect an unlicensed public construction site",
    "The public park equipment is broken",
    "A public signboard has fallen down",
    "There is a noise issue at a public venue",
    "The community facility needs maintenance",
    "A damaged public bench needs repair",
    "Please help with an issue not listed in the categories",
    "The public playground fence is damaged",
    "A tree branch is blocking the sidewalk",
  ],
};

const PRIORITY_EXAMPLES = {
  Critical: [
    "Open manhole on main road causing accident risk",
    "Exposed live electrical wire is sparking near pedestrians",
    "A collapsed road is causing vehicles to crash",
    "Sewage flood is entering a hospital and homes",
    "Burst water main is flooding a major road and trapping people",
    "An open drain has already caused serious injuries",
    "Contaminated drinking water is making many residents sick",
    "A fallen power pole is blocking emergency vehicle access",
    "Deep uncovered pit creates immediate danger to children",
    "Building collapse debris is blocking the busy road",
    "Fire hydrant is broken during an active fire emergency",
    "A large tree has fallen across the main road during a storm",
  ],
  High: [
    "Garbage has accumulated near a public area for several days",
    "Waste is overflowing beside a school and attracting pests",
    "A blocked sewer has flooded multiple homes",
    "No water is available across the entire apartment complex",
    "Several deep potholes are causing repeated vehicle damage",
    "Street lights are out across the busy market road",
    "A broken pipe is wasting water across the neighborhood",
    "Uncollected rubbish is blocking access to the bus stop",
    "The public drain has been overflowing for three days",
    "A large pothole affects traffic on the main road",
    "Sewage smell and waste are affecting the local clinic",
    "Many residents have reported the same water shortage",
  ],
  Medium: [
    "Street light not working in one lane",
    "A few garbage bags remain beside the community bin",
    "One pothole is present on a residential side road",
    "The water tap has reduced pressure in one building",
    "A small drain is blocked near one house",
    "One street lamp flickers in the evening",
    "Please collect the waste bin this afternoon",
    "A pavement tile is loose on the sidewalk",
    "A minor leak is visible from one water connection",
    "The roadside gutter needs routine cleaning",
    "A streetlight bulb is broken in a quiet lane",
    "The neighborhood bin is nearly full",
  ],
  Low: [
    "Minor civic issue that needs a routine inspection",
    "Please check the public bench when convenient",
    "A small amount of litter is beside the park path",
    "One decorative light is not working in the garden",
    "The footpath tile is slightly uneven but passable",
    "Please schedule routine maintenance for the public sign",
    "There is a minor issue with a single waste bin",
    "A small drip is present at a garden water tap",
    "A few leaves are covering the edge of the drain",
    "One pavement stone needs ordinary maintenance",
    "Please inspect a minor road marking issue",
    "The public area needs a routine cleanup",
  ],
};

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "at",
  "be",
  "been",
  "for",
  "from",
  "has",
  "have",
  "in",
  "is",
  "it",
  "of",
  "on",
  "the",
  "there",
  "to",
  "was",
  "were",
  "with",
]);

const normalize = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (text) =>
  normalize(text)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const termsFor = (text) => {
  const tokens = tokenize(text);
  const terms = [...tokens];
  for (let index = 0; index < tokens.length - 1; index += 1) {
    terms.push(`${tokens[index]}_${tokens[index + 1]}`);
  }
  return terms;
};

const softmax = (logits) => {
  const maximum = Math.max(...logits);
  const exponentials = logits.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
};

const trainModel = (examples) => {
  const labels = Object.keys(examples);
  const trainingDocuments = labels.flatMap((label) => examples[label]);
  const trainingLabels = labels.flatMap((label) =>
    examples[label].map(() => labels.indexOf(label))
  );
  const documentFrequency = new Map();

  trainingDocuments.forEach((document) => {
    new Set(termsFor(document)).forEach((term) => {
      documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
    });
  });

  const vocabulary = new Map(
    [...documentFrequency.keys()].map((term, index) => [term, index])
  );
  const inverseDocumentFrequency = new Float64Array(vocabulary.size);
  vocabulary.forEach((index, term) => {
    inverseDocumentFrequency[index] =
      Math.log(1 + trainingDocuments.length / documentFrequency.get(term)) + 1;
  });

  const vectorize = (document) => {
    const counts = new Map();
    termsFor(document).forEach((term) => {
      const index = vocabulary.get(term);
      if (index !== undefined) {
        counts.set(index, (counts.get(index) || 0) + 1);
      }
    });

    let magnitude = 0;
    const vector = new Map();
    counts.forEach((count, index) => {
      const weight = count * inverseDocumentFrequency[index];
      vector.set(index, weight);
      magnitude += weight ** 2;
    });

    const norm = Math.sqrt(magnitude);
    if (norm > 0) {
      vector.forEach((weight, index) => {
        vector.set(index, weight / norm);
      });
    }
    return vector;
  };

  const vectors = trainingDocuments.map(vectorize);
  const weights = labels.map(
    () => new Float64Array(vocabulary.size)
  );
  const biases = new Float64Array(labels.length);
  const learningRate = 0.18;
  const regularization = 0.0001;
  const iterations = 650;

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const rate = learningRate / (1 + iteration * 0.003);

    vectors.forEach((vector, sampleIndex) => {
      const logits = biases.map((bias, classIndex) => {
        let score = bias;
        vector.forEach((value, featureIndex) => {
          score += weights[classIndex][featureIndex] * value;
        });
        return score;
      });
      const probabilities = softmax(logits);

      probabilities.forEach((probability, classIndex) => {
        const error =
          probability - (trainingLabels[sampleIndex] === classIndex ? 1 : 0);
        vector.forEach((value, featureIndex) => {
          weights[classIndex][featureIndex] -=
            rate *
            (error * value + regularization * weights[classIndex][featureIndex]);
        });
        biases[classIndex] -= rate * error;
      });
    });
  }

  return {
    labels,
    vectorize,
    predict(text) {
      const vector = vectorize(text);
      const probabilities = softmax(
        biases.map((bias, classIndex) => {
          let score = bias;
          vector.forEach((value, featureIndex) => {
            score += weights[classIndex][featureIndex] * value;
          });
          return score;
        })
      );
      const bestIndex = probabilities.reduce(
        (best, probability, index) =>
          probability > probabilities[best] ? index : best,
        0
      );

      return {
        label: labels[bestIndex],
        confidence: Number(probabilities[bestIndex].toFixed(4)),
      };
    },
  };
};

const categoryModel = trainModel(CATEGORY_EXAMPLES);
const priorityModel = trainModel(PRIORITY_EXAMPLES);

const predictComplaint = (description) => ({
  category: categoryModel.predict(description),
  priority: priorityModel.predict(description),
});

module.exports = {
  CATEGORY_EXAMPLES,
  PRIORITY_EXAMPLES,
  predictComplaint,
};
