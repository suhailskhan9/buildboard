import pool from "../config/database.js";

export async function createTask({ projectId, taskData }){
    const result = await pool.query(`INSERT INTO tasks (project_id, assigned_to_id, title, description, status, due_date) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [projectId, taskData.assigned_to_id, taskData.title, taskData.description, taskData.status, taskData.due_date]
    );

    return result.rows[0];
}

export async function getTasks({ projectId, limit, offset, status, assignedToId, search}) {
    let whereClause = `WHERE project_id = $1`;

    const values = [projectId];
    let parameterIndex = 2;

    if (status !== undefined) {
        whereClause += ` AND status = $${parameterIndex}`;
        values.push(status);
        parameterIndex++;
    }

    if (assignedToId !== undefined) {
        whereClause += ` AND assigned_to_id = $${parameterIndex}`;
        values.push(assignedToId);
        parameterIndex++;
    }

    if (search !== undefined) {
        whereClause += `
            AND (
                title ILIKE $${parameterIndex}
                OR description ILIKE $${parameterIndex}
            )
        `;
        values.push(`%${search}%`);
        parameterIndex++;
    }

    const query = `SELECT * FROM tasks ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${parameterIndex}
        OFFSET $${parameterIndex + 1}
    `;

    const taskValues = [...values, limit, offset]

    const result = await pool.query(query, taskValues);

    const countQuery = `SELECT COUNT(*) AS total FROM tasks ${whereClause}`;

    const countResult = await pool.query(countQuery, values);

    return {
        tasks: result.rows,
        total: Number(countResult.rows[0].total)
    };
}


export async function getTaskById({ projectId, taskId }) {
    const result = await pool.query(`SELECT * FROM tasks WHERE id = $1 AND project_id = $2`, [taskId, projectId]);
    return result.rows[0];
}

export async function updateTask({ projectId, taskId, taskData }) {
    const fields = [];
    const values = []

    let paramIndex = 1;

    if(taskData.title !== undefined) {
        fields.push(`title = $${paramIndex}`)
        values.push(taskData.title)
        paramIndex++;
    }

    if(taskData.description !== undefined) {
        fields.push(`description = $${paramIndex}`)
        values.push(taskData.description)
        paramIndex++;
    }

    if(taskData.assigned_to_id !== undefined) {
        fields.push(`assigned_to_id = $${paramIndex}`);
        values.push(taskData.assigned_to_id);
        paramIndex++;
    }

    if(taskData.status !== undefined) {
        fields.push(`status = $${paramIndex}`);
        values.push(taskData.status);
        paramIndex++;
    }

    if(taskData.due_date !== undefined) {
        fields.push(`due_date = $${paramIndex}`);
        values.push(taskData.due_date);
        paramIndex++;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(taskId, projectId);

    const result = await pool.query(`UPDATE tasks SET ${fields.join(", ")} WHERE id = $${paramIndex} AND project_id = $${paramIndex+1} RETURNING *`, values);

    return result.rows[0];  
}

export async function deleteTask({ projectId, taskId }) {
    const result = await pool.query(`DELETE FROM tasks WHERE id = $1 AND project_id = $2 RETURNING *`, [taskId, projectId]);
    return result.rows[0];
}