const Joi = require('@hapi/joi')

exports.registrationView = (req, res, next) => {
    res.render("visitor/registration", {
        title: 'Registration',
        homeURL: web.home.url,
        committeeURL: web.committee.url,
        registrationURL: web.registration.url,
        csrfToken: req.csrfToken()
    })
}

exports.registration = (req, res, next) => {
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
}