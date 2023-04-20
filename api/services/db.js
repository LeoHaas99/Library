// talk to db
const mysql = require('mysql2/promise')

// to read the .env file
require('dotenv').config()

// create the pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: process.env.CONNECTION_LIMIT
})


/**
 * Executes an SQL query in the database pool.
 * @param {String} sqlString A string with SQL. Use ? as placeholder.
 * @param {Array} parameters An array of parameters to replace the placeholders with.
 * @returns {Promise<Array>} Returns array with results.
 */
async function query(sqlString, parameters) {
    const [results,] = await pool.query(sqlString, parameters)
    return results ? results : []
}

module.exports = {
    query
}