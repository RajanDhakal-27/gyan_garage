export type ItemType = 'resource' | 'homework';

export interface LearningItem {
  id: string;
  item_type: ItemType;
  title: string;
  description: string | null;
  resource_type: string | null;
  subject: string | null;
  topic: string | null;
  external_url: string | null;
  instructions: string | null;
  due_at: string | null;
  created_at: string;
}

export type CreateResourceInput = {
  title: string;
  description?: string;
  resource_type?: string;
  subject?: string;
  topic?: string;
  external_url?: string;
};

export type CreateHomeworkInput = {
  title: string;
  description?: string;
  subject?: string;
  instructions?: string;
  due_at?: string;
};

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  marks: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  duration_seconds: number;
  questions: QuizQuestion[];
  created_at: string;
}

export type CreateQuizInput = {
  title: string;
  description?: string;
  subject?: string;
  duration_seconds: number;
  questions: QuizQuestion[];
};
