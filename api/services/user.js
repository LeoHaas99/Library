const db = require('./db')
const helper = require('../helper')

/**
 * Retrieves a user by their ID from the database and returns the result in a standardized format.
 *
 * @async
 * @function getById
 * @param {number|string} userId - The ID of the user to retrieve from the database.
 * @returns {Promise<Object>} A Promise that resolves with an object containing the retrieved user's ID, username, and email.
 * @throws Will throw an error if the user ID is invalid or if the user is not found in the database.
 */
async function getById(userId) {
    // validate user id
    if (!userId) return helper.respond(400, 'VALIDATION_ERROR', ['FIELD_USER_ID_INVALID'])
    if (typeof (userId) != 'number') userId = parseInt(userId)
    if (userId == NaN || userId == 'NaN') return helper.respond(400, 'VALIDATION_ERROR', ['FIELD_USER_ID_INVALID'])

    const rows = await db.query(
        `SELECT id, username, email FROM user WHERE id = ?`,
        [userId]
    )

    if (rows.length == 0) return helper.respond(404, 'USER_NOT_FOUND')
    else return helper.respond(200, 'OK', rows[0])
}

module.exports = {
    getById,
}