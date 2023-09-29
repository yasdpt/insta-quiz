import express from "express";
import dotenv from "dotenv";

import indexRouter from "./routes/index";
import gameRouter from "./routes/game";
import { setupExtensions, handleErrors } from "./util/setup";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT;

const app = express();

app.use("/", indexRouter);
app.use("/game", gameRouter);

setupExtensions(app);
handleErrors(app);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

export default app;
