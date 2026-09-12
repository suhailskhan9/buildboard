import { Pool } from "pg";
import { config } from "./config.js";

const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.name,
    user: config.database.user,
    password: config.database.password
})

export async function withTransaction(callback) {
    const client = await pool.connect();
    
    try{
        await client.query("BEGIN");

        const result = await callback(client);
         
        await client.query("COMMIT");

        return result;
    }
    catch(err) {
        await client.query("ROLLBACK");
        throw err;
    }
    finally {
        client.release();
    }
    
}

export default pool;