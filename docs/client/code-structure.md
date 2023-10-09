# Code structure

In this guide you will learn how **InstaQuiz** client works and how you can extend it for your own usage.

## How it works

The client uses Vue.Js and Tailwindcss for a good UI experience for the users, axios and Socket.IO client library for communicating with the server.

Vue's [Pinia](https://pinia.vuejs.org/introduction.html) state management library is used to manage state around the application each page has it's own "store" that manages state of the page. stores are at `./client/src/stores`.

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

you can use them throughout the web app with tailwind syntax for example a background color will be:

```html
<div class="bg-tgBackground">
...
</div>
```

### Routing

There 3 main pages in the application:

* HomeView
* JoinView
* GameView

Game id for joining is passed through bot's link and start\_param query, in router's beforeEach route guard when home page is opened we check if start\_param is present and forward the user to JoinView

{% code title="src/router/index.ts" %}
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
{% endcode %}

### Components

To make the code more readable views have been separated in some components in the `./client/src/components` folder and they are prefixed with the name of the view.

> The ones without a view prefix are used by multiple views.

### Configs

`./client/src/configs` files are for global functions and tools used in the application and it contains code for axios base setup of handling default base url of http server, headers and handling errors which if it was an auth 401 error it will try to close the web app.

And `socketConfigs.ts` for configuring the connection with the servers socket.

> One more colorConfigs.ts file is there to get a random tailwindcss color string to use when creating the circle beside the user's name in leaderboard, because when starting the app with menu button or an inline button the user's [photo\_url](https://core.telegram.org/bots/webapps#webappuser) field will not be sent.

### Elements

Almost all elements in the application are simple HTML one's except the category selector for the HomeView that is located in ./client/src/components/HomeSelect.vue that uses [headlessui](https://headlessui.com/)'s ListBox elements for a feel of still being in Telegram.



### Ready

When each view is mounted we can call [windows.Telegram.webApp.ready()](https://core.telegram.org/bots/webapps#initializing-mini-apps) which will tell Telegram that the app is ready to be shown to the user and also .expand() function to expand the page and be able to show more data.

{% code title="src/views/HomeView.vue" %}
```typescript
const webApp = window.Telegram.WebApp;

onMounted(() => {
  webApp.ready();
  webApp.expand();
  // More actions
});
```
{% endcode %}

## Working with sockets

Each client can listens to updates regarding the game they're in with the gameId that was sent from them to the server which joins them in a Socket.IO [`room`](https://socket.io/docs/v4/rooms/) `which is used to assign messages sent from the server to the correct client.`

### Callbacks

Each emit request can also have a callback that when the code on the server is done returns a result which is more like a Rest API that can be useful for knowing the result of the operation or receive some extra data.

> For the callback to work on the server, the client has to have a callback function as it's last inputted parameter.

An example for a callback in the code:

{% code title="joinGameStore.ts" %}
```typescript
socket.emit(
  "getWaitList",
  gameInfo.value?.id,
  gameInfo.value?.status,
  (response: any) => { // callback function as last parameter
    // response is a json object and contains all data
    if (response.status === 200) {
      // Handle success
    } else {
      // Handle failure
    }
  }
);
```
{% endcode %}

### Listening to events

Each view can listen to events coming from the socket and update the ui, for example the wait list:

{% code title="joinGameStore.ts" %}
```typescript
socket.on("updateWaitList", (waitList) => {
  // if data exists, update the list of users in wait list
  if (waitList) {
    users.value = waiList;
  }
});
```
{% endcode %}



## Reactivity

All reactive elements in the web app are handled by VueJs's [Reactivity API](https://vuejs.org/api/reactivity-core.html).

[ref()](https://vuejs.org/api/reactivity-core.html#ref) was used for holding reactive data, and [computed()](https://vuejs.org/api/reactivity-core.html#computed) for processing new data based on the reactive objects. an example of computed:

<pre class="language-typescript" data-title="gameStore.ts"><code class="lang-typescript"><strong>// Return boolean to check if the game is running
</strong><strong>// Changes when gameInfo is updated.
</strong><strong>const gameIsRunning = computed(() => gameInfo.value?.status === 1);
</strong></code></pre>

> Remember to use computed values only for UI components, functions in the store do not need reactivity.

