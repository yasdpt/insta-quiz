import { Router } from "express";
import verifyToken from "../middleware/auth";
import pool from "../util/pool";
import { User } from "../models/user";

const router = Router();

/*
 * Create or update user
 */
router.post("/create", verifyToken, async function (req, res) {
  const user: User = req.body;
  try {
    // Try to insert user, if user already exists update their data
    const result = await pool.query(
      `insert into users (id, first_name, last_name, username, is_bot, language_code, is_premium, 
       added_to_attachment_menu, allows_write_to_pm, photo_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) 
       DO UPDATE SET first_name = excluded.first_name, last_name = excluded.last_name, 
       username = excluded.username, is_bot = excluded.is_bot, language_code = excluded.language_code,
       is_premium = excluded.is_premium, added_to_attachment_menu = excluded.added_to_attachment_menu,
       allows_write_to_pm = excluded.allows_write_to_pm, photo_url = excluded.photo_url, updated_at = now() RETURNING *;`,
      [
        user.id,
        user.first_name,
        user.last_name,
        user.username,
        user.is_bot,
        user.language_code,
        user.is_premium,
        user.added_to_attachment_menu,
        user.allows_write_to_pm,
        user.photo_url,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log("[POST] /users/create: " + error);
    res.status(500).json({ message: "Failed to upsert user" });
  }
});

export default router;
