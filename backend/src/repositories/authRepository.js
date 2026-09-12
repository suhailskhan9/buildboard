import pool from '../config/database.js';

export async function findByEmail(email) {
    const result = await pool.query("SELECT id, password_hash FROM users WHERE email = $1", [email])
    return result.rows[0];
}

export async function findByUsername(username) {
   const result = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
   return result.rows[0];
}

export async function createUser({ email, username, passwordHash}) {
    await pool.query("INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3)", [email, username, passwordHash]);
}
