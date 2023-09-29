import { Router } from "express";
import verifyToken from "../middleware/auth";
import pool from "../util/pool";

const router = Router();

router.get("/", verifyToken, function (req, res) {
  try {
    pool.query("SELECT * FROM categories ORDER BY id ASC", (error, results) => {
      if (error) {
        res.status(500).json({ message: "Failed to get categories" });
      } else {
        res.status(200).json(results.rows);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get categories" });
  }
});

export default router;
