"use strict";

// import other usefull modules
const http = require('http')
const https = require('https')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const config = require('config')
const csrf = require('csurf')
const { readFileSync } = require('fs')
const favicon = require('serve-favicon')

// import module from project
const { sessionStore, cookieStore } = require(join(BASE_DIR, 'core', 'storage'))
const { logger } = require(join(BASE_DIR, 'core', 'util'))
const { mongoClient } = require(join(BASE_DIR, 'db', 'database'))
const auth = require(join(BASE_DIR, 'core', 'auth'))

require(join(BASE_DIR, 'app', 'autoLoader'))

// calling express function
const app = express()

//favicon
app.use(favicon(join(BASE_DIR, 'public', 'site', 'img', 'icon', 'favicon.ico')))

// node js process error handle
process.on('uncaughtException', (err) => {
    console.log(err)
    logger.error(err)
})

process.on('unhandledRejection', (err) => {
    console.log(err)
    logger.error(err)
})

// security configuretaion
app.use(helmet())
app.use(compression())

// set view engine configuretaion
app.set('view engine', 'ejs')
app.set('views', join(BASE_DIR, 'views'))

// app configuretaion
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(join(BASE_DIR, 'public')))
app.use(express.static(join(BASE_DIR, 'custom')))

// csrf configuretion
cookieStore(app)
app.use(csrf({ cookie: true }))

sessionStore(app)

// auth configuretion
auth(app)

// web routing
app.use("/", require(join(BASE_DIR, "routes", "web")))

// 404 page not found
app.use((req, res) => {
    res.render("error/404")
})

// error handle
app.use((err, req, res, next) => {
    console.log(err)
    logger.error(err)
    res.status(500).send("Something fail");
})

// start mongodb and then runing the app on defined port number
mongoClient
    .then(() => {
        if (process.env.NODE_ENV === "production") {
            https.createServer({
                key: readFileSync(join(config.get('ssl.privkey')), 'utf8'),
                cert: readFileSync(join(config.get('ssl.cert')), 'utf8'),
                ca: readFileSync(join(config.get('ssl.chain')), 'utf8')
            }, app).listen(config.get("PORT"), () => console.log(`app is runing https server on port ${config.get("PORT")}`))
        } else {
            http.createServer(app).listen(config.get("PORT"), () => console.log(`app is runing http server on port ${config.get("PORT")}`))
        }
    })
    .catch(err => {
        logger.error(err)
    })