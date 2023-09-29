import { Router } from "express";
const router = Router();

/* GET home page. */
router.get("/", function (_req, res) {
  res.send("Welcome to this app!");
});
export default router;
