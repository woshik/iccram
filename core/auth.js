const passport = require('passport')
const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const { ObjectId } = require('mongodb')

module.exports = (app) => {
    passport.use('admin',
        new localStrategy({ usernameField: 'email' }, (email, password, done) => {
            let admin = new model('admin')
            admin.findOne({ email: email })
                .then(userData => {
                    if (!userData) return done(null, false, { message: "Email address not register" })
                    bcrypt.compare(password, userData.password)
                        .then(isMatch => {
                            if (isMatch) {
                                return done(null, userData)
                            }
                            return done(null, false, { message: "Password doesn't match" })
                        })
                        .catch(err => done(err))
                })
                .catch(err => done(err))
        })
    )

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    })

    passport.deserializeUser((id, done) => {
        let user = new model('admin')
        user.findOne({ _id: ObjectId(id) }, { email: 1, })
            .then(async userData => {
                if (!userData) {
                    return done(null, false)
                }
                done(null, userData)
            })
            .catch(err => done(err))
    })

    app.use(passport.initialize())
    app.use(passport.session())
}