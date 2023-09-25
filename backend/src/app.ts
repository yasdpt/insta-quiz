import createError from "http-errors";
import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

import indexRouter from "./routes/index";

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
});

const whiteList = [""];

if (process.env.NODE_ENV !== "production") {
    whiteList.push("http://localhost:5173");
    whiteList.push("https://192.168.43.202:5173");
}

app.use(helmet());
app.use(limiter);
app.use(
    cors({
        origin: whiteList,
    })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.disable("x-powered-by");

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (_req: Request, _res: Response, next: NextFunction) {
    next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send("error");
});

app.listen("3000", () => {
    console.log(`⚡️[server]: Server is running at http://localhost:3000`);
});

export default app;
