/**
 * 伴侣理解测试相关类型定义
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizOption {
  id: number;
  text: string;
  score: number;
}

export interface QuizAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  score: number;
}

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  feedback: string;
  recommendations: string[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isCompleted: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface QuizProgress {
  current: number;
  total: number;
  percentage: number;
}



