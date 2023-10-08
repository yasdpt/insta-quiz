import { Markup, Telegraf } from "telegraf";
import pool from "./pool";

// Send game link with category name to user using webAppQuery received from frontend
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
    const gameLink = `${process.env.TG_GAME_URL}?startapp=${gameId}`;
    await bot.telegram.answerWebAppQuery(webAppQuery, {
      id: "0",
      type: "article",
      title: "Your game was created!",
      input_message_content: {
        message_text: `A game in the category "${categoryName}" was created🎉\n\n▶️ Click button below to share it to your friends or click link below and play it yourself\n\n<a href="${gameLink}">🔗 Join game</a>`,
        parse_mode: "HTML",
      },
      ...Markup.inlineKeyboard([
        // TG_APP_URL is direct link of your website, not web app's bot link.
        Markup.button.url(
          "Share game 🎮",
          `https://t.me/share/url?url=${gameLink}&text=Hi!👋 Join me in a quiz game 🎮 of ${categoryName} category!`
        ),
      ]),
    });
  } catch (error) {
    console.log(`Send bot message error: ${error}`);
  }
};

export default sendGameDataToUser;
