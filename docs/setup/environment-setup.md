# Environment setup

Follow instructions below to setup your development environment.

## Cloning

Clone the project from Github in your terminal:

```bash
git clone https://github.com/yasdpt/insta-quiz.git

cd insta-quiz
```

## Installing dependencies

The project is in a monorepo structure and the code for the backend is in `./server` folder and the code for the frontend is in `./client` folder

To install server dependencies from the root folder run commands:

```bash
cd server

# install server dependencies
pnpm install

# Create environment variables and replace them with your own values
cp .env.example .env
```

After signing up at [Neon](https://neon.tech) and creating your database you will receive a connection string, set them in your `.env` file from this format:

`postgres://<PGUSER>:<PGPASSWORD>@<PGHOST>/<PGDATABASE>`

To install client dependencies from the root folder run commands:

```bash
cd client

# install client dependencies
pnpm install

# Create environment variables
cp .env.example .env
# env for production run
cp .env.example .env.production
```

## Database

After setting environment variables for your server now you can create and populate your database with it's tables, categories and questions. some sample categories with around 50 questions are located at `./server/db/categories` in json format and ready scripts to create the database.

You can download complete data from [here](https://github.com/yasdpt/insta-quiz) and put them in the categories folder

Go to server folder and run these commands:

```bash
# go to server folder from root folder
cd server

# database creation script
node db/create.js

# (optional) populate your database with questions, may take some time to run
node db/seed.js
```

## Bot

Create a Telegram bot if you haven't already and if not you can follow these instructions from the official Telegram website: [https://core.telegram.org/bots/tutorial](https://core.telegram.org/bots/tutorial)

Once you have the bot token put it in the server's .env file
