# Folder structure

```bash
├── db # db related files (Not compiled with source code)
│   ├── categories # questions json
│   ├── queries
│   │   └── quizdb.sql # db create sql
│   ├── create.js # create db script
│   └── seed.js # seed db script
├── src # main directory
│   ├── app.ts # main app entry
│   ├── events # socket event handlers
│   │   ├── answer.ts # receive user answers and score them
│   │   ├── waitlist.ts # return game wait list to user
│   │   ├── join.ts # join user to a game room
│   │   ├── start.ts # start game and game loop
│   │   └── index.ts
│   ├── middleware
│   │   └── auth.ts # auth middleware with Telegram initData
│   ├── routes # rest api routes
│   │   ├── categories.ts # get list of categories
│   │   ├── games.ts # game info and creating a new game
│   │   ├── users.ts # update user info in db
│   │   ├── home.ts # home page
│   │   └── index.ts
│   ├── types # returned data interfaces
│   │   ├── game-info.ts
│   │   ├── leaderboard.ts
│   │   └── user.ts
│   └── util # app util and setup
│       ├── bot-util.ts # handle sending inline query result with bot
│       ├── cache.ts # init node-cache
│       ├── game-loop.ts # game loop handler util
│       ├── game-util.ts # game info and leaderboard util
│       ├── pool.ts # database pool init
│       └── setup.ts # setup express middlewares
├── .gitignore
├── .env # env variables
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json

```
