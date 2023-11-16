import { Express, Request, Response, NextFunction } from "express";
import {login_this_user, logout_this_user} from './controllers/users.controller'
import {log, errorLogger} from './logger/'
import {show_bad_message, show_good_message } from "./functions/utils";
import { requireUser } from "./middleware/requireUser";
const Cookies = require('cookies');

const routes = (app: Express) => {
    // checks to see if our servers are running as they should
    app.get('/healthCheck', (req, res) => {
        const currentFilename = __filename;
        log.info({currentFilename}, 'checking my log')
        res.json('its all good')
    })

    // healthCheck for accessToken and refreshToken
    app.post('/healthCheck/accessToken', requireUser, (req, res) => {
        //@ts-ignore
        const new_token = req.body.loggedInDts.new_token || ''
        let returnMsg = {}

        if (new_token === 'yes') {
            returnMsg = {...show_good_message(), new_token, dts:req.body.loggedInDts}
        } else {
            returnMsg = show_good_message()
        }

        res.json(returnMsg)
    })

    //--START-- routes for users
    // this route logsIn a new user
    app.post('/users/login', async (req: Request, res: Response) => {
        // const dts = await login_this_user(req.body)
        // res.json(dts)

        const cookies = new Cookies(req, res);

        // Set a cookie with a maxAge of 2 hours (in milliseconds)
        const twoHoursInMilliseconds = 2 * 60 * 60 * 1000;
        cookies.set('myCookie', 'Hello, Cookie!', { maxAge: twoHoursInMilliseconds });
      
        res.json('Cookie has been set!');
    })

    // gets the session data
    app.post('/users/getSessionData', async (req: Request, res: Response) => {
        // Retrieve a cookie

        const cookies = new Cookies(req, res);

        // Retrieve a cookie value
        const myCookieValue = cookies.get('myCookie');
      
        res.json(`Value of myCookie: ${myCookieValue}`);
    })

    // this route logout the user
    app.post('/users/logout', async (req: Request, res: Response) => {
        const dts = await logout_this_user(req.body)
        res.json(dts)
    })
    //--END--
}

export default routes