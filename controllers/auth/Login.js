const passport = require("passport")
const Joi = require('@hapi/joi')
const {fromErrorMessage} = require(join(BASE_DIR, 'core', 'util'))

exports.loginView = (req, res) => {
    res.render("auth/login", {
        title: "Admin Login",
        csrfToken: req.csrfToken(),
        loginForm: web.login.url,
        successMessage: req.flash('successMessage'),
        errorMessage: req.flash('errorMessage')
    })
}

exports.login = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().trim().email().required().label("Email address"),
        password: Joi.string().trim().min(5).max(50).label("Password")
    })

    const validateResult = schema.validate({
        email: req.body.email,
        password: req.body.password
    })

    if (validateResult.error) {
        return res.status(200).json({
            success: false,
            message: fromErrorMessage(validateResult.error.details[0])
        })
    }

    passport.authenticate('admin', function(err, user, info) {
        if (err) return next(err)
        if (!user) {
            return res.status(200).json({
                success: false,
                message: info.message
            })
        }
        
        req.login(user, (err) => {
            if (!!err) next(err)
            return res.status(200).json({
                success: true,
                message: web.dashboard.url
            })
        })
    })(req, res, next)
}