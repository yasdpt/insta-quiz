export interface ScoreboardUser {
  user_id: number;
  first_name: string;
  last_name: string;
  score: number;
  answers: ScoreboardAnswer[];
}

export interface ScoreboardAnswer {
  question_id: number;
  answer_id: number;
  is_correct: boolean;
}
