interface Game {
  id: number;
  owner_id: number;
  category_id: number;
  status: number;
  user_first_name: string;
  user_last_name: string;
  category_name: string;
}

interface GameInfo {
  id: number;
  owner_id: number;
  category_id: number;
  status: number;
  last_question_time: string;
  current_question: number;
  question_index: number;
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
