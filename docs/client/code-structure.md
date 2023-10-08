# Code structure

In this guide you will learn how **InstaQuiz** client works and how you can extend it for your own usage.

## How it works

The client uses Vue.Js and Tailwindcss for a good UI experience for the users, axios and Socket.IO client library for communicating with the server.

Vue's Pinia state management library is used to manage state around the application each page has it's own "store" that manages state of the page. stores are at `./client/src/stores`.

### Telegram communication

Communication with Telegram is done through their library for web apps that is injected in the index.html file located in `./client/index.html`. you can add below line to your index file's header and use it in your own app.

{% code title="index.html" %}
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```
{% endcode %}

It attaches a Telegram object to window property, in this project `./client/src/types/telegram.d.ts` was created to handle types for all variables and functions in the Telegram object. and has detailed explanation about all of them and is up to date with **Bot API 6.9** alternatively you can install [@types/telegram-web-app](https://www.npmjs.com/package/@types/telegram-web-app) package for automatically receiving updates to the API with updating it, run below command to install:

```bash
pnpm install --save @types/telegram-web-app
```

### Themes

Telegram passes user's main theme colors thorugh css variables and you can use them in your project. in this project it was configured with Tailwindcss's extended themes.

{% code title="./client/tailwind.config.js" %}
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tgBackground: "var(--tg-theme-bg-color)",
        tgText: "var(--tg-theme-text-color)",
        tgHint: "var(--tg-theme-hint-color)",
        tgLink: "var(--tg-theme-link-color)",
        tgButton: "var(--tg-theme-button-color)",
        tgButtonText: "var(--tg-theme-button-text-color)",
        tgSecondaryBackground: "var(--tg-theme-secondary-bg-color)",
      },
    },
  },
  plugins: [],
};

```
{% endcode %}

### Routing

There 3 main pages in the application:

* HomeView
* JoinView
* GameView

Game id for joining is passed through bot's link and start\_param query, in router's beforeEach route guard when home page is opened we check if start\_param is present and forward the user to JoinView

```typescript
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameView from "../views/GameView.vue";
import JoinView from "../views/JoinView.vue";

const routes = [
  ... // routes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((from, to) => {
  const webApp = window.Telegram.WebApp;
  // Check if app is opened and start_param is present and pass it
  // as game query parameter to JoinView
  if (!to.name && from.name === "home" && webApp.initDataUnsafe.start_param) {
    return {
      name: "join",
      query: {
        game: webApp.initDataUnsafe.start_param,
      },
    };
  }
});

export default router;

```

&#x20;
