<p align="center">
  <a href="https://yasdpt.ir"><img src="https://i.postimg.cc/d3sqwbyg/insta-quiz-round.png" alt="Logo" height=170></a>
</p>
<h1 align="center">InstaQuiz</h1>

<p align="center">
<a href="https://telegram.org" target="_blank"><img height=20 src="https://img.shields.io/badge/Telegram-Mini_App-red" /></a>
<img src="https://img.shields.io/badge/Typescript-007acc" alt="Typescript"> <img src="https://img.shields.io/badge/ExpressJs-FFFFFF" alt="ExoressJs"> <img src="https://img.shields.io/badge/Socket.IO-000000" alt="VueJs"> <img src="https://img.shields.io/badge/Postgresql-0064a5" alt="Postgresql"> <img src="https://img.shields.io/badge/VueJS-42b883" alt="VueJs">

<div align="center">
<a href="https://t.me/IQuizzBot">Sample bot</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://yasdpt.gitbook.io/instaquiz">Documentation</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/yasdpt/insta-quiz/issues/new">Issues</a>
  <br />
</div>

## What is InstaQuiz?

InstaQuiz (Instant Quiz) is a real-time multiplayer quiz game made for Telegram Mini App platform. Players can create quiz rooms and invite friends to join for fast-paced trivia fun. The app is built using Typescript, Express.js, Postgresql and Vue.js.

You can see an example bot: [InstaQuiz bot](https://t.me/IQuizzBot)

You can read the documentation at [here](https://yasdpt.gitbook.io/instaquiz) or go to [Quick links](#quick-links) section and read right here on Github.

## Requirements

Git and Github, Node, PNPM and an IDE.

## Setup

Follow below instructions to setup the code.

### Clone

```sh
git clone https://github.com/yasdpt/insta-quiz.git

cd insta-quiz
```

### Server setup

```sh
# from root folder
cd server

# install server dependencies
pnpm install

# create environment variables and replace them with your own values
cp .env.example .env
```

### Client setup

```sh
#from root folder
cd client

# install client dependencies
pnpm install

# Create environment variables
cp .env.example .env

# env for production run
cp .env.example .env.production
```

## More

For complete documentation follow links below

### Quick links

- Intro
  - [Introduction](docs/README.md)
- Setup
  - [Requirements](docs/setup/requirements.md)
  - [Environment setup](docs/setup/environment-setup.md)
  - [Testing](docs/setup/testing.md)
- Database
  - [Schema](docs/database/schema.md)
  - [Setup](docs/database/setup.md)
- Server
  - [Folder structure](docs/server/folder-structure.md)
  - [Code structure](docs/server/code-structure.md)
  - [API reference](docs/server/api-reference.md)
- Client
  - [Folder structure](docs/client/folder-structure.md)
  - [Code structure](docs/client/code-structure.md)
- Deployment
  - [Your own server](docs/deployment/your-own-server.md)
  - [Fly.io](docs/deployment/fly.io.md)

## License

This project is licensed under the GPL-3.0 license.
