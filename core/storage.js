const config = require("config")
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const cookieParser = require("cookie-parser")

exports.sessionStore = (app) => {
    app.use(session({
        secret: config.get("secret_key"),
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            url: config.get("database_connection_string"),
            collection: "sessions",
            ttl: (24 * 60 * 60),
            secret: config.get("secret_key"),
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        }),
    }))
}


exports.cookieStore = (app) => {
    app.use(cookieParser(config.get("secret_key"), {
        domain: config.get("domain_name"),
        maxAge: (24 * 60 * 60),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        SameSite: process.env.NODE_ENV === "production" ? true : false
    }))
}