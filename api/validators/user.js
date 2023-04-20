const db = require('../services/db')
const helper = require('../helper')

/**
 * Response of a validation function.
 * @typedef {Object} ValidatorResponse
 * @property {Boolean} valid Whether or not the validation was successful
 * @property {String} [reason] (optional) fail reason
 * @property {Number} [code] (optional) A HTTP response code
 */

/** 
* Validate a username.
* @param {String} username Username.
* @return {Promise<ValidatorResponse>} Validation result.
*/
async function validateUsername(username) {
    // validate username
    if (!username) return { valid: false, reason: 'FIELD_USERNAME_INVALID' }
    if (typeof (username) != 'string') return { valid: false, reason: 'FIELD_USERNAME_INVALID' }

    // check username length
    if (username.length == 0 || username.length > 100) return { valid: false, reason: 'INVALID_USERNAME_LENGTH' }

    return { valid: true }
}

/** 
* Validate an email.
* @param {String} email User email address.
* @return {Promise<ValidatorResponse>} Validation result.
*/
async function validateEmail(email, userId) {
    // validate email
    if (!email) return { valid: false, reason: 'INVALID_EMAIL' }
    if (typeof (email) != 'string') return { valid: false, reason: 'INVALID_EMAIL' }
    if (!/^[\w.+-]+@[\w.-]+\.[\w]{2,18}$/.test(email)) return { valid: false, reason: 'INVALID_EMAIL' }

    email = email.toLowerCase()

    // check if email is already in use
    let emailExistsResult

    // for updating a user, check if users, excluding self, already uses this email
    if (userId) emailExistsResult = await db.query(`SELECT * FROM user WHERE email = ? AND id != ?`, [email, userId])
    // for creating a user, check if any user uses this email
    else emailExistsResult = await db.query(`SELECT * FROM user WHERE email = ?`, [email])

    // email in use?
    if (emailExistsResult.length > 0) return { valid: false, reason: 'EMAIL_IN_USE' }

    return { valid: true }
}

/** 
* Validate a password.
* @param {string} password User password.
* @return {Promise<ValidatorResponse>} Validation result.
*/
async function validatePassword(password, passwordRepeat) {
    // typecheck
    if (!password) return { valid: false, reason: 'FIELD_PASSWORD_INVALID' }
    if (typeof (password) != 'string') return { valid: false, reason: 'FIELD_PASSWORD_INVALID' }

    // length check
    if (password.length < 8) helper.respond(400, 'PASSWORD_GUIDELINE_LENGTH')

    // enforce security guidelines (at least one number and one special character)
    if (!/[0-9]/.test(password)) return { valid: false, reason: 'PASSWORD_GUIDELINE_INCLUDE_NUMBER' }
    if (!/[^A-Za-z0-9]/.test(password)) return { valid: false, reason: 'PASSWORD_GUIDELINE_INCLUDE_SPECIAL' }

    // check if repeated password matches password
    if (password !== passwordRepeat) return { valid: false, reason: `PASSWORD_MISMATCH` }

    return { valid: true }
}

/** 
* Validate a user id.
* @param {Number} userId Id of a user.
* @return {Promise<ValidatorResponse>} Validation result.
*/
async function validateUserId(userId) {
    // validate user id
    if (!userId) return { valid: false, reason: 'FIELD_USER_ID_INVALID' }
    if (typeof (userId) != 'number') userId = parseInt(userId)
    if (userId == NaN || userId == 'NaN') return { valid: false, reason: 'FIELD_USER_ID_INVALID' }

    // check if user exists
    try {
        const userIdResult = await db.query(`
            SELECT * FROM user
            WHERE id = ?`, [userId]
        )
        if (userIdResult.length == 0) return { valid: false, reason: `USER_NOT_FOUND`, code: 404 }

        return { valid: true }
    } catch (err) {
        return { valid: false, reason: 'FIELD_USER_ID_INVALID' }
    }
}

module.exports = {
    validateUserId,
    validateUsername,
    validateEmail,
    validatePassword
}