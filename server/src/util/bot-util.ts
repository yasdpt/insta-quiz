import { Markup, Telegraf } from "telegraf";
import pool from "./pool";

const sendGameDataToUser = async (
  webAppQuery: string,
  gameId: number,
  categoryId: number
) => {
  try {
    const catRes = await pool.query("SELECT * FROM categories WHERE id = $1", [
      categoryId,
    ]);
    const bot = new Telegraf(process.env.BOT_TOKEN ?? "");
    const categoryName = catRes.rows[0].name;
    await bot.telegram.answerWebAppQuery(webAppQuery, {
      id: "0",
      type: "article",
      title: "Your game was created!",
      input_message_content: {
        message_text: `A game in the category "${categoryName}" was created, send this message for your friends to join the game!`,
      },
      ...Markup.inlineKeyboard([
        // WEB_APP_URL is direct link of your website, not web app's bot link.
        Markup.button.webApp(
          "Join game",
          `${process.env.WEB_APP_URL || ""}/join?game=${gameId}`
        ),
      ]),
    });
  } catch (error) {
    console.log(`Send bot message error: ${error}`);
  }
};

export default sendGameDataToUser;
