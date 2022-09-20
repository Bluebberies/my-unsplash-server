const express = require('express')
const app = express()
const winston = require('winston')
require('dotenv').config()

require('./startup/logging')()
require("./startup/requestAnalysers")(app);
require("./startup/uploads")(app);
require('./startup/prod')(app)

const port = process.env.PORT
app.listen(port, () => {
  winston.info(`Listening on port ${port}`)
})
