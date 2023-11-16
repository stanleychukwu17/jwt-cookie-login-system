//--START-- importation fo assets
import express from 'express'
import cors from 'cors'
require('dotenv').config()

import routes from './routes'
const {connectToDb, getDb, pool} = require('./db')

import deserializeUser from './middleware/deserializeUser'

// for the error logger
import {log, errorLogger} from './logger'
import { get_the_line_where_this_error_occurred } from './functions/utils'
//--END--

//* creates an express app
const port = process.env.PORT || 4000
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and HTTP authentication
    optionsSuccessStatus: 204, // Set the status for successful preflight requests
}))
app.use(deserializeUser); // checks to see if the user is a has a valid accessToken or refreshToken

//* how to log errors for debugging purposes
const logError = () => {
    // below is how to use the logger to log both errors and information, we have .info, .error, .warn, and .debug methods
    errorLogger.info({stanley:'my  name is stanley', lastName: 'my last name is chukwu'})

    const error = new Error('Error occurred').stack!; // this will help me to get the line where the error occurred, then we will use regular expression to capture only the information that wee need
    const capturedErrorLine = get_the_line_where_this_error_occurred({errorMessage: error})
    errorLogger.error({'lineNumber': capturedErrorLine}, 'see error message 2')
}
// logError()

//* connect to the postgres database and then allow express to receive request
pool.connect((err: any, client: any, release: () => void) => {
    if (err) {
        return console.log('Error connecting to the postgresSQL database, because: ', err.stack)
    }

    app.listen(port, () => {
        console.log(`now listening to request from port ${port}`)
        routes(app)
    })

    release()
})