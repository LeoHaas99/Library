const express = require('express')
const cors = require('cors')
const app = express()
const auth = require('./services/auth')
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

// to read the .env file
require('dotenv').config()

// routers
const authRouter = require('./routes/auth')
const bookRouter = require('./routes/book')

// request body config
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());
app.use(express.static('public')); //to access the files in public folder

// CORS headers
app.use(cors({
    credentials: true, origin: (origin, callback) => {
        // allow requests without origin
        if (!origin) return callback(null, true)

        if (process.env.ALLOWED_ORIGINS.indexOf(origin) === -1)
            return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false)
        else return callback(null, true)
    },
}))

// standard response
app.get('/api/v1', (req, res) => {
    res.send('Library API v1.0.0');
})

// API routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/book', bookRouter)

// error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    console.error('error:', err.message, err.stack)
    res.status(statusCode).json({ message: err.message })
    return
})

// file upload api
app.post('/api/v1/upload', auth.getCurrentPermission, async (req, res) => {
    if (req.permission) {
        if (!req.files) {
            return res.status(500).send({ msg: "file is not found" })
          }
          //allowed file types
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
          // accessing the file
          let myFile = req.files.image;
          if (!allowedTypes.includes(myFile.mimetype)) {
            return res.status(500).send({ msg: "Wrong file type, images of type jpeg, jpg, png and webp are allowed" });
          }
          const name = path.parse(myFile.name).name;
          const ext = path.parse(myFile.name).ext;
          myFile.name = name + "_" + Date.now() + ext;
        
          //  mv() method places the file inside public directory
          myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
            if (err) {
              console.log(err)
              return res.status(500).send({ msg: "Error occured" });
            }
            // returing the response with file path and name
            return res.send({ name: myFile.name, path: `http://localhost:5000/${myFile.name}` });
          });
    } else {
        res.status(401).json({ message: `INSUFFICIENT_PERMISSION` })
    }
})

// file remove api
app.delete('/api/v1/remove/:fileUrl', auth.getCurrentPermission, async (req, res) => {
    if (req.permission) {
        fs.unlink(`${__dirname}/public/${req.params.fileUrl}`, function (err) {
            if (err) {
              console.log(err)
              return res.status(500).send({ msg: "Error occured" });
            }
            return res.send({ msg: "File deleted succesfully" });
          });
    } else {
        res.status(401).json({ message: `INSUFFICIENT_PERMISSION` })
    }

})


// start
app.listen(process.env.PORT, () => {
    console.log(`Digitale Fotowand API listening at http://localhost:${process.env.PORT}/api/v1`)
})