# Folder structure

```bash
├── public # public directory for static files
│   └── quiz.png
├── src # main code directory
│   ├── assets 
│   ├── components
│   │   ├── AppHeader.vue
│   │   ├── GameInfo.vue
│   │   ├── GameQuestion.vue # question and answers component
│   │   ├── GameScore.vue # leaderboard list component
│   │   ├── HomeSelect.vue # category select component
│   │   ├── JoinGameLoading.vue
│   │   ├── JoinUserList.vue # user wait list component
│   │   └── Loading.vue
│   ├── configs
│   │   ├── axiosConfigs.ts # axios configs for http calls
│   │   ├── colorConfigs.ts # random color generator
│   │   └── socketConfigs.ts # configs for socket connection
│   ├── router
│   │   └── index.ts # app router
│   ├── stores
│   │   ├── gameStore.ts # game state manager
│   │   ├── homeStore.ts # home state manager
│   │   └── joinGameStore.ts # join state manager
│   ├── types # types for different parts of app
│   │   ├── category.d.ts
│   │   ├── game.d.ts
│   │   ├── leaderboard.d.ts
│   │   ├── telegram.d.ts # full interface for Telegram object that attaches window
│   │   └── user.d.ts
│   ├── views # main pages
│   │   ├── GameView.vue # showing game questions and leaderboard
│   │   ├── HomeView.vue # create game from list of categories
│   │   └── JoinView.vue # see who's in game and join
│   ├── App.vue # vue main entry
│   ├── main.ts # main app entry
│   ├── style.css # global styles
│   └── vite-env.d.ts # vite env variables
├── .gitignore
├── .env # env variables for local development
├── .env.production # env variables for production environment
├── tailwind.config.js # custom config for tailwindcss
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts # custom config for 
├── README.md
├── index.html # main html page(Telegram script included here)
├── package.json
├── pnpm-lock.yaml
└── postcss.config.js
```
