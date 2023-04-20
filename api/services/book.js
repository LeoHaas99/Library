const db = require('./db')
const helper = require('../helper')

/**
Retrieves a list of all employees including their information such as Id, Name, Position, Beruf, Enddatum and BildUrl.
@async
@function getAll
@returns {Promise<APIResponse>} - An object containing the status code, message, and an array of employee information.
@throws {Error} - If there was an error retrieving the employee information from the database.
*/
async function getAll() {
      const rows = await db.query(
        `SELECT BuchId, Buchtitel, Autor, Seitenzahl, Jahr, BildUrl, Favorit FROM buch
        JOIN autor ON autorid = fk_autorid
        ORDER BY BuchId`
      );
      return helper.respond(200, 'OK', rows)
}

module.exports = {
    getAll,
}