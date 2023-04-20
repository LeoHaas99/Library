// route writings URI to function
const express = require('express')
const router = express.Router()
const auth = require('../services/auth')

// Get current user from session
router.get('/', async (req, res, next) => {
    try {
        const response = await auth.getCurrentUser(auth.getAccessToken(req))
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

// refresh token
router.post('/token', async (req, res, next) => {
    try {
        const refreshToken = req.body.refreshToken

        const response = await auth.refreshAccessToken(refreshToken)
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

// Login
router.post('/login', async (req, res, next) => {
    try {
        // validate the credentials and respond
        const response = await auth.login(req.body.email, req.body.password)
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

// Change password
router.put('/changePassword', async (req, res, next) => {
    try {
        const response = await auth.changePassword(req.body.email, req.body.oldPassword, req.body.newPassword1)
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

// Create Account
router.post('/createAccount', async (req, res, next) => {
    try {
        // validate the credentials and respond
        const response = await auth.createAccount(req.body.username, req.body.email, req.body.password1)
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

// Logout
router.get('/logout', async (req, res, next) => {
    try {
        const response = await auth.logout(req.query.refreshToken)
        res.status(response.status).send(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

module.exports = router