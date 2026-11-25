import { CreateHomeworkInput } from "@/types/database";

export const SAMPLE_HOMEWORK: CreateHomeworkInput[] = [
  {
    title: "SEE Compulsory Mathematics - Statistics Exercise 14.1",
    subject: "Mathematics",
    description: "Mean, Median and Quartile deviation practice exercises from CDC textbook.",
    instructions:
      "1. Open textbook Page 184, Exercise 14.1.\n2. Complete Questions 1 through 12 in your homework copy.\n3. Show clear formula calculation steps for frequency tables.\n4. Highlight your final answers.",
    due_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Grade 10 Science - Unit 1 Gravitation Numerical Problems",
    subject: "Science",
    description: "Newton's universal gravitation law and acceleration due to gravity.",
    instructions:
      "Solve numerical problems #3, #5, #7, and #8 on page 28 of your Science book.\nRemember: G = 6.67 x 10^-11 N m^2/kg^2. Show unit conversions explicitly.",
    due_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Compulsory English - Free Writing Essay on 'Federalism in Nepal'",
    subject: "English",
    description: "Unit 3 Essay writing prompt aligned with SEE blueprint.",
    instructions:
      "Write an essay in about 200 words on 'Federalism in Nepal: Prospects and Challenges'.\nInclude three main sections: Introduction, Key Opportunities & Challenges, and Conclusion with your personal reflection.",
    due_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Social Studies - Timeline Chart of Democratic Movements",
    subject: "Social Studies",
    description: "Key constitutional milestones in contemporary Nepali history.",
    instructions:
      "Draw a neat chronological timeline chart on an A4 sheet illustrating:\n- 2007 BS Revolution\n- 2046 BS Janandolan I\n- 2062/63 BS Janandolan II and promulgation of the 2072 Constitution.\nWrite two major achievements for each milestone.",
    due_at: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
