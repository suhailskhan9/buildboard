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

    export async function getProjectMembers({ projectId }) {
        const result = await pool.query(`SELECT u.id, u.username, u.email, pm.role FROM project_members pm JOIN users u ON pm.user_id = u.id WHERE pm.project_id = $1`, [projectId]);
        return result.rows;
    }

    export async function addProjectMember({projectId, userId, role}) {
        const result = await pool.query(`INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *`,
            [projectId, userId, role]
        )
        return result.rows[0];
    }

    export async function removeProjectMember({ projectId, userId }) {
        const result = await pool.query(`DELETE FROM project_members WHERE project_id = $1 AND user_id = $2 RETURNING *`, [projectId, userId]);
        return result.rows[0];
    }