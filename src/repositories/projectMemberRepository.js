    import pool from "../config/database.js"

    export async function create(client, data) {
        const result = await client.query(
            `INSERT into project_members (project_id, user_id, role)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [data.projectId, data.userId, data.role]
        );

        return result.rows[0]
    }

    export async function getMembership({ projectId, userId }) {
        const result = await pool.query(`SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2`,
            [projectId, userId]
        );

        return result.rows[0];
    }