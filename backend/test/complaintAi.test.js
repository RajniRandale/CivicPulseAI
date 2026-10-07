const assert = require("node:assert/strict");
const test = require("node:test");

const {
  analyzeComplaint,
  departmentMap,
  findDuplicateMatches,
} = require("../utils/complaintAi");

test("trained complaint classifier predicts expected categories and departments", () => {
  const examples = [
    [
      "Road near APSIT has many potholes",
      "Road Damage / Potholes",
      "Road Department",
    ],
    [
      "Garbage has not been collected near APSIT",
      "Garbage & Waste Management",
      "Sanitation Department",
    ],
    [
      "Street light is not working",
      "Street Light",
      "Electrical Department",
    ],
    [
      "Drainage water is overflowing",
      "Drainage & Sewerage",
      "Drainage Department",
    ],
    [
      "Water is not available",
      "Water Supply",
      "Water Department",
    ],
  ];

  examples.forEach(([description, expectedCategory, expectedDepartment]) => {
    const prediction = analyzeComplaint(description);
    assert.equal(prediction.category, expectedCategory, description);
    assert.equal(prediction.department, expectedDepartment, description);
    assert.ok(prediction.categoryConfidence >= 0);
    assert.ok(prediction.categoryConfidence <= 1);
  });
  assert.equal(departmentMap.Other, "General Civic Department");
});

test("trained priority classifier distinguishes the requested urgency levels", () => {
  const examples = [
    [
      "Open manhole on main road causing accident risk",
      "Critical",
    ],
    [
      "Garbage has accumulated near a public area for several days",
      "High",
    ],
    [
      "Street light not working in one lane",
      "Medium",
    ],
    [
      "Minor civic issue",
      "Low",
    ],
  ];

  examples.forEach(([description, expectedPriority]) => {
    assert.equal(
      analyzeComplaint(description).priority,
      expectedPriority,
      description
    );
  });
});

test("duplicate matching requires matching category, similar text, and nearby location", () => {
  const complaints = [
    "Garbage has not been collected in front of APSIT College",
    "There is garbage accumulated near APSIT College",
    "APSIT college road garbage is not being picked up",
    "Garbage problem near APSIT",
  ];
  const existing = complaints.slice(0, 3).map((description, index) => ({
    id: index + 101,
    category: "Garbage & Waste Management",
    department: "Sanitation Department",
    title: description.slice(0, 40),
    description,
    location: "APSIT College",
    latitude: 19.2183,
    longitude: 72.9781,
    status: "Pending",
  }));

  const matches = findDuplicateMatches(
    {
      category: "Garbage & Waste Management",
      department: "Sanitation Department",
      description: complaints[3],
      location: "APSIT College",
      latitude: 19.2184,
      longitude: 72.9782,
    },
    existing
  );

  assert.equal(matches.length, 3);
  assert.deepEqual(
    matches.map((match) => match.id).sort((first, second) => first - second),
    [101, 102, 103]
  );

  assert.equal(
    findDuplicateMatches(
      {
        category: "Garbage & Waste Management",
        department: "Sanitation Department",
        description: complaints[3],
        location: "Another city",
        latitude: 19.5,
        longitude: 73.2,
      },
      existing
    ).length,
    0
  );
  assert.equal(
    findDuplicateMatches(
      {
        category: "Road Damage / Potholes",
        department: "Road Department",
        description: complaints[3],
        location: "APSIT College",
        latitude: 19.2184,
        longitude: 72.9782,
      },
      existing
    ).length,
    0
  );
  assert.equal(
    findDuplicateMatches(
      {
        category: "Garbage & Waste Management",
        department: "Sanitation Department",
        description: "The public bin needs repainting",
        location: "APSIT College",
        latitude: 19.2184,
        longitude: 72.9782,
      },
      existing
    ).length,
    0
  );
});
