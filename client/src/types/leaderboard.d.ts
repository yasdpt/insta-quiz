interface Leaderboard {
  user_id: number;
  first_name: string;
  last_name: string;
  score: number;
  answers: LeaderboardAnswer[];
}

interface LeaderboardAnswer {
  question_id: number;
  answer_id: number;
  is_correct: boolean;
}
