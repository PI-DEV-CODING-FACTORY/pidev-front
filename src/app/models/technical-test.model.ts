export interface TechnicalTest {
  id: number;
  title: string;
  description?: string;
  createdAt: string | null;
  deadline?: string;
  isCompleted: boolean;
  score?: number;
  technologies: string[];
  proposal: Proposal | null;
  questions: Question[];
  timeSpentSeconds?: number;
}

export interface Question {
  id: number;
  text: string;
  explanation?: string;
  points: number;
  isMultipleChoice: boolean;
  options?: string[];
  userAnswer?: string | string[];
  correctAnswer?: string | string[];
  selectedAnswers?: string[];
  isCorrect?: boolean;
  technicalTest: TechnicalTest | null;
}

export interface Proposal {
  id: number | null;
  studentId: string | null;
  companyId: string | null;
  status: ProposalStatus;
  createdAt: string | null;
  respondedAt: string | null;
  message: string | null;
  technicalTest: TechnicalTest | null;
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  CHECKBOX = 'CHECKBOX',
  TEXT = 'TEXT',
  CODE = 'CODE'
}

export interface TimeUnit {
  durationEstimated: boolean;
  timeBased: boolean;
  dateBased: boolean;
}

export interface TimeSpent {
  seconds: number;
  zero: boolean;
  nano: number;
  negative: boolean;
  positive: boolean;
  units: TimeUnit[];
}

export interface TestAnswer {
  questionId: number;
  answer: string;
}

export interface TechnicalTestSubmission {
  technicalTestId: number;
  answers: TestAnswer[];
  timeSpent: TimeSpent;
  cheated: boolean;
} 