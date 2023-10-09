import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import GameView from "../views/GameView.vue";
import JoinView from "../views/JoinView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/join",
    name: "join",
    component: JoinView,
  },
  {
    path: "/game",
    name: "game",
    component: GameView,
  },
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
