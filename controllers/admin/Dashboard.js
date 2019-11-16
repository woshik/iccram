const Joi = require('@hapi/joi')
const { hashPassword, fromErrorMessage } = require(join(BASE_DIR, 'core', 'util'))
const model = require(join(BASE_DIR, 'db', 'model'))


exports.dashboardView = (req, res, next) => {
    const reg = new model('registration')
    reg.find({}, { _id: 1 })
        .then(result => {
            let dashboardData = {
                title: 'Dashboard',
                email: req.user.email,
                sidebar: sideBar,
                regCount: result.length,
                csrfToken: req.csrfToken(),
                path: req.path,
            }

            res.render("admin/dashboard", dashboardData)
        })
        .catch(err => next(err))
}

exports.logout = (req, res) => {
    req.logout()
    res.redirect(web.login.url)
}

exports.profileSetting = (req, res, next) => {

    if (!!req.body.password || !!req.body.confirm_password) {
        const schema = Joi.object({
            email: Joi.string().trim().email().required().label("Email address"),
            password: Joi.string().trim().min(5).max(50).required().label("Password"),
            confirm_password: Joi.ref("password")
        })

        const validateResult = schema.validate({
            email: req.body.email,
            password: req.body.password,
            confirm_password: req.body.confirm_password
        })

        if (validateResult.error) {
            return res.status(200).json({
                success: false,
                message: fromErrorMessage(validateResult.error.details[0])
            })
        }

        hashPassword(validateResult.value.password)
            .then(passwordHashed => {
                adminInfoUpdate(req, res, next, {
                    'email': validateResult.value.email,
                    'password': passwordHashed,
                })
            })
            .catch(err => next(err))
    } else {
        const schema = Joi.object({
            email: Joi.string().trim().email().required().label("Email address"),
        })

        const validateResult = schema.validate({
            email: req.body.email,
        })

        if (validateResult.error) {
            return res.status(200).json({
                success: false,
                message: fromErrorMessage(validateResult.error.details[0])
            })
        }

        adminInfoUpdate(req, res, next, {
            'email': validateResult.value.email,
        })
    }
}

function adminInfoUpdate(req, res, next, adminInfo) {
    let admin = new model('admin')
    admin.updateOne({ _id: req.user._id }, adminInfo)
        .then(adminUpdateValue => {
            if (!adminUpdateValue.result.nModified) {
                return res.status(200).json({
                    success: false,
                    message: 'Server Error. Please try again later.'
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Successfully updated infomations.'
            })
        })
        .catch(err => next(err))
}