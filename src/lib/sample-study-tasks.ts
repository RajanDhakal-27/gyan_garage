import { CreateStudyTaskInput } from "@/types/database";

export const SAMPLE_STUDY_TASKS: CreateStudyTaskInput[] = [
  {
    title: "Revise Optional Math Trigonometry proofs",
    description: "Review compound angle formulas and practice 5 long questions from CDC model question set.",
    target_date: new Date().toISOString().split("T")[0], // Today
  },
  {
    title: "Solve Science Unit 1 Numerical Questions",
    description: "Calculate universal gravitation and acceleration due to gravity for Earth and Moon on Page 28.",
    target_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
  },
  {
    title: "Memorize 10 English Idioms & Phrasal Verbs",
    description: "Practice using idioms in original sentences for the SEE free-writing question.",
    target_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // In 2 days
  },
  {
    title: "Draw Nepal Federal Map with 7 Provinces",
    description: "Mark major rivers, mountain peaks, and provincial headquarters on blank outline map for Social Studies.",
    target_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // In 4 days
  },
  {
    title: "Nepali Byakaran: Karak and Bibhakti exercise",
    description: "Complete textbook exercises on Prathama to Saptami bibhakti with correct sentence examples.",
    target_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // In 5 days
  },
];
