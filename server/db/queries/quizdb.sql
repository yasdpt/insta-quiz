CREATE TABLE "users" (
    "id" bigint   NOT NULL,
    "first_name" varchar(64)   NULL,
    "last_name" varchar(64)   NULL,
    "username" varchar(32)   NULL,
    "is_bot" boolean   NULL,
    "language_code" boolean   NULL,
    "is_premium" boolean   NULL,
    "added_to_attachment_menu" boolean   NULL,
    "allows_write_to_pm" boolean   NULL,
    "photo_url" text   NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL,
    CONSTRAINT "pk_users" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "categories" (
    "id" bigserial   NOT NULL,
    "name" varchar(64)   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL,
    CONSTRAINT "pk_categories" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "games" (
    "id" bigserial   NOT NULL,
    "owner_id" bigint   NOT NULL,
    "category_id" bigint   NOT NULL,
    "status" bigint   NOT NULL,
    "current_question" bigint   NOT NULL,
    "last_question_time" timestamp   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL,
    CONSTRAINT "pk_games" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "game_users" (
    "game_id" bigint   NOT NULL,
    "user_id" bigint   NOT NULL,
    "score" smallint   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL
);

CREATE TABLE "questions" (
    "id" bigserial   NOT NULL,
    "category_id" bigint   NOT NULL,
    "text" text   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL,
    CONSTRAINT "pk_questions" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "answers" (
    "id" bigserial   NOT NULL,
    "question_id" bigint   NOT NULL,
    "text" text   NOT NULL,
    "is_correct" boolean   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL,
    "updated_at" timestamp  DEFAULT now() NOT NULL,
    CONSTRAINT "pk_answers" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "game_questions" (
    "game_id" bigint   NOT NULL,
    "question_id" bigint   NOT NULL
);

CREATE TABLE "game_user_answers" (
    "user_id" bigint   NOT NULL,
    "game_id" bigint   NOT NULL,
    "question_id" bigint   NOT NULL,
    "answer_id" bigint   NOT NULL,
    "created_at" timestamp  DEFAULT now() NOT NULL
);

ALTER TABLE "games" ADD CONSTRAINT "fk_games_owner_id" FOREIGN KEY("owner_id")
REFERENCES "users" ("id");

ALTER TABLE "games" ADD CONSTRAINT "fk_games_category_id" FOREIGN KEY("category_id")
REFERENCES "categories" ("id");

ALTER TABLE "games" ADD CONSTRAINT "fk_games_current_question" FOREIGN KEY("current_question")
REFERENCES "questions" ("id");

ALTER TABLE "game_users" ADD CONSTRAINT "fk_game_users_game_id" FOREIGN KEY("game_id")
REFERENCES "games" ("id");

ALTER TABLE "game_users" ADD CONSTRAINT "fk_game_users_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "questions" ADD CONSTRAINT "fk_questions_category_id" FOREIGN KEY("category_id")
REFERENCES "categories" ("id");

ALTER TABLE "answers" ADD CONSTRAINT "fk_answers_question_id" FOREIGN KEY("question_id")
REFERENCES "questions" ("id");

ALTER TABLE "game_questions" ADD CONSTRAINT "fk_game_questions_game_id" FOREIGN KEY("game_id")
REFERENCES "games" ("id");

ALTER TABLE "game_questions" ADD CONSTRAINT "fk_game_questions_question_id" FOREIGN KEY("question_id")
REFERENCES "questions" ("id");

ALTER TABLE "game_user_answers" ADD CONSTRAINT "fk_game_user_answers_user_id" FOREIGN KEY("user_id")
REFERENCES "users" ("id");

ALTER TABLE "game_user_answers" ADD CONSTRAINT "fk_game_user_answers_game_id" FOREIGN KEY("game_id")
REFERENCES "games" ("id");

ALTER TABLE "game_user_answers" ADD CONSTRAINT "fk_game_user_answers_question_id" FOREIGN KEY("question_id")
REFERENCES "questions" ("id");

ALTER TABLE "game_user_answers" ADD CONSTRAINT "fk_game_user_answers_answer_id" FOREIGN KEY("answer_id")
REFERENCES "answers" ("id");
