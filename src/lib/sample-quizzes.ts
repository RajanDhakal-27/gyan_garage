import { CreateQuizInput } from "@/types/database";

export const SAMPLE_QUIZZES: CreateQuizInput[] = [
  {
    title: "SEE Science: Force & Gravitation Objective Test",
    subject: "Science",
    description:
      "A timed 10-minute assessment covering Newton's law of gravitation, free fall, and gravitational field intensity for Class 10.",
    duration_seconds: 600,
    questions: [
      {
        id: "q1",
        question: "What is the value of Universal Gravitational Constant (G)?",
        options: [
          "6.67 × 10^-11 N m²/kg²",
          "9.8 m/s²",
          "6.67 × 10^11 N m²/kg²",
          "1.67 × 10^-27 kg",
        ],
        correct_answer: "6.67 × 10^-11 N m²/kg²",
        marks: 1,
      },
      {
        id: "q2",
        question:
          "What is the acceleration due to gravity on the surface of the Moon compared to Earth?",
        options: [
          "Approximately 1/6th of Earth's gravity",
          "Equal to Earth's gravity",
          "Double Earth's gravity",
          "Zero",
        ],
        correct_answer: "Approximately 1/6th of Earth's gravity",
        marks: 1,
      },
      {
        id: "q3",
        question:
          "Which formula correctly calculates the weight (W) of an object of mass m?",
        options: ["W = m × g", "W = m / g", "W = G × m", "W = m × v²"],
        correct_answer: "W = m × g",
        marks: 1,
      },
      {
        id: "q4",
        question: "What happens to the weight of a body in free fall?",
        options: [
          "Becomes zero (Weightlessness)",
          "Doubles",
          "Remains unchanged",
          "Increases exponentially",
        ],
        correct_answer: "Becomes zero (Weightlessness)",
        marks: 1,
      },
    ],
  },
  {
    title: "Class 10 Opt Math: Trigonometric Compound Angles",
    subject: "Mathematics",
    description:
      "Essential compound angle formulas and standard identity evaluations for Class 10 SEE examination.",
    duration_seconds: 900,
    questions: [
      {
        id: "qm1",
        question: "What is the expansion of sin(A + B)?",
        options: [
          "sin A cos B + cos A sin B",
          "sin A sin B + cos A cos B",
          "cos A cos B - sin A sin B",
          "sin A cos B - cos A sin B",
        ],
        correct_answer: "sin A cos B + cos A sin B",
        marks: 1,
      },
      {
        id: "qm2",
        question: "What is the formula for cos(2A) in terms of sin A?",
        options: ["1 - 2sin²A", "2cos²A - 1", "cos²A - sin²A", "2sin A cos A"],
        correct_answer: "1 - 2sin²A",
        marks: 1,
      },
      {
        id: "qm3",
        question: "If tan A = 1 and A is acute, what is the value of angle A?",
        options: ["45°", "30°", "60°", "90°"],
        correct_answer: "45°",
        marks: 1,
      },
    ],
  },
  {
    title: "SEE English: Grammar, Prepositions & Question Tags",
    subject: "English",
    description:
      "Practice high-frequency CDC SEE question tags, prepositions of time/place, and conditional grammar structures.",
    duration_seconds: 480,
    questions: [
      {
        id: "qe1",
        question: "Choose the correct tag: 'Let's have a tea party, ______?'",
        options: ["shall we", "will you", "don't we", "aren't we"],
        correct_answer: "shall we",
        marks: 1,
      },
      {
        id: "qe2",
        question: "He has been living in Kathmandu ______ 2018.",
        options: ["since", "for", "from", "at"],
        correct_answer: "since",
        marks: 1,
      },
      {
        id: "qe3",
        question: "If it rains tomorrow, we ______ the picnic.",
        options: ["will cancel", "would cancel", "cancelled", "cancel"],
        correct_answer: "will cancel",
        marks: 1,
      },
    ],
  },
];
