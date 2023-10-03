export interface GameInfo {
  id: number;
  owner_id: number;
  category_id: number;
  status: number;
  last_question_time: string;
  current_question: number;
  questions: Question[];
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

interface Answer {
  id: number;
  text: string;
  is_correct: boolean;
}
