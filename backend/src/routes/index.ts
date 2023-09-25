import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function (_req, res) {
  res.send("Welcome to this app!");
});

export default router;
