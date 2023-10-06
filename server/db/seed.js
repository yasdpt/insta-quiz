const fs = require("fs");
const path = require("path");
const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const client = new pg.Client({
  ssl: true,
});

async function seed() {
  console.log("Seeding database, this operation may take some time...");
  await client.connect();
  try {
    const folder = "./db/categories";

    const jsonsInDir = fs
      .readdirSync(folder)
      .filter((file) => path.extname(file) === ".json");

    for (let index = 0; index < jsonsInDir.length; index++) {
      const file = jsonsInDir[index];
      const fileData = fs.readFileSync(path.join(folder, file));
      const json = JSON.parse(fileData.toString());
      const res = await client.query(
        "INSERT INTO public.categories (name) VALUES ($1) RETURNING *",
        [json.category_name]
      );
      for (let i = 0; i < json.questions.length; i++) {
        const question = json.questions[i];
        const questionRes = await client.query(
          "INSERT INTO public.questions (category_id, text) VALUES ($1, $2) RETURNING *",
          [res.rows[0].id, question.question]
        );

        for (let ai = 0; ai < question.answers.length; ai++) {
          const answer = question.answers[ai];
          await client.query(
            "INSERT INTO public.answers (question_id, text, is_correct) VALUES ($1, $2, $3)",
            [questionRes.rows[0].id, answer, answer === question.ca]
          );
        }

        console.log(
          `Created question [${questionRes.rows[0].id}](${res.rows[0].name}): ${questionRes.rows[0].text}`
        );
      }
      console.log(`Created category: ${res.rows[0].name}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.end();
    process.exit();
  }
}

seed();
