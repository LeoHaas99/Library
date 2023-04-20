// route writings URI to function
const express = require('express')
const router = express.Router()
const book = require('../services/book')
const auth = require('../services/auth')


// Get all photos
router.get('/', async (req, res, next) => {
    try {
        const response = await book.getAll()
        res.status(response.status).json(response.body)
    } catch (err) {
        res.status(err.status || 500).send(err.body || { message: 'GENERAL_ERROR' })
    }
})

module.exports = router