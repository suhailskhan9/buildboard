import { config } from './config/config.js';

import app from './app.js';
import pool from './config/database.js';
import logger from './config/logger.js';


const PORT = config.port;

try {
    const res = await pool.query("SELECT NOW()");
    logger.info("Connected to the database");
}
catch(err) {
    logger.error(err, "Database connection failed");
    process.exit(1);
}

app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`);
})