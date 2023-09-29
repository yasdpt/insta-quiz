import { Request, Response, NextFunction } from "express";
import { createHmac } from "node:crypto";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.get("Authorization");
  const telegramInitData = authorization?.split(" ")[1] ?? "";

  if (!telegramInitData) {
    return res.status(401).json({ message: "No token provided" });
  }
  const botToken = process.env.BOT_TOKEN ?? "";

  // The data is a query string, which is composed of a series of field-value pairs.
  const encoded = decodeURIComponent(telegramInitData);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = createHmac("sha256", "WebAppData").update(botToken);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = createHmac("sha256", secret.digest())
    .update(dataCheckString)
    .digest("hex");

  // if hash are equal the data may be used on your server.
  // Complex data types are represented as JSON-serialized objects.
  if (_hash === hash) {
    next();
  } else {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};

export default verifyToken;
