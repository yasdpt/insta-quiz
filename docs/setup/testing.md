# Testing

After setting up your environment, now you can run your project and test it with Telegram client.

## Running

### Server

To run the application from the root of the project run commands:

```bash
cd server

# For the first run before running the app build it so don't run into any
# problems because the project is written in Typescript, it will build and
# run with nodemon at the same time
pnpm run build

# Then after build run the server
pnpm run dev
```

### Client

For the first run you may need to do extra action for installing certificates on your device but it is mostly handled automatically, The app uses mkcert for local development to be able to test it locally with Telegram.

Open a new terminal and from root of the project run commands:

```bash
cd client

# run the client
pnpm run dev
```

After running the app the URL will show up in terminal and you can use it for creating the mini app in the [next](https://yasdpt.gitbook.io/instaquiz/setup/testing#setting-up-the-bot) step, for example:

```bash
 VITE v4.4.5  ready in 2102 ms

  ➜  Local:   https://localhost:5173
  ➜  Network: https://192.168.43.202:5173 # Use this when creating the mini app
```

## Setting up the bot

This guide assumes you've already setup your bot

To create your mini app go to [@botfather](https://t.me/botfather) and send `/newapp` command, select your bot and follow the instructions to send the title, description, a 640x360 pixels image, and the URL to your web app client URL from the last step (You can change it later with real production URL) and create it .

Users can start your bot in two ways to open the game so the bot can get [query\_id](https://core.telegram.org/bots/webapps#webappinitdata) send an inline query message for the user.

### Menu button

After creating the mini app you will receive the link to your mini app and you can send `/setmenubutton` command to Bot Father and give the link to the client as the URL and a title for the button. More info: [Inline Button Mini Apps](https://core.telegram.org/bots/webapps#inline-button-mini-apps)

### Inline button

Set your bot to send a message on start or any other command a message with a [web\_app](https://core.telegram.org/bots/webapps#inline-button-mini-apps) type inline keyboard. Remember to set the actual client URL for the link or it won't work.

An example with [Telegraf.Js](https://telegrafjs.org) bot library for NodeJs

```typescript
import { Markup, Telegraf } from 'telegraf';

const bot = new Telegraf(env.process.BOT_TOKEN ?? '');

bot.start((ctx) => {
  ctx.reply(
    'Welcome to InstaQuiz, click button below to create a new game!',
    Markup.inlineKeyboard([
      Markup.button.webApp('Open InstaQuiz', process.env.TG_APP_URL ?? ''),
    ]),
  );
});

bot.launch();
```

After setting up your bot you can `/start` your bot or run the app from the menu button and test it!
