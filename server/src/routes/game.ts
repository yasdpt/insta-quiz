import { Router } from "express";
const router = Router();

/* GET home page. */
router.get("/", function (_req, res) {
  res.status(404);
  res.send("Not found!");
});

router.post("/createGame", function (req, res) {
    
});

export default router;
