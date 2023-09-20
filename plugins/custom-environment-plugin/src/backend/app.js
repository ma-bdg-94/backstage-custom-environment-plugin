const express = require('express')
const cors = require('cors')
const { connectDB } = require('./database')
const routes = require('./api/routes')
require('dotenv').config()

// initiate app
const app = express()

// implement cors
app.use(cors({
  origin: 'http://localhost:3000'
}));

// connect to DB
connectDB()

// implement body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

// implement api routes
app.use(routes)

// run server
const port = process.env.APP_PORT || 3100
app.listen(port, () => console.log(`App is running at port:${port}!`))
