const Joi = require('@hapi/joi')
const { fromErrorMessage } = require(join(BASE_DIR, 'core', 'util'))

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
        name: Joi.string().trim().required().label("Name"),
        email: Joi.string().trim().email().required().label("Email address"),
        profession: Joi.string().trim().required().label("Profession"),
        designation: Joi.string().trim().required().label("Designation"),
        mobile: Joi.string().trim().required().label("Mobile"),
        institute: Joi.string().trim().required().label("Institute"),
        department: Joi.string().trim().required().label("Department"),
        title: Joi.string().trim().required().label("Title"),
        abstract: Joi.string().trim().required().label("Abstract"),
    })

    const validateResult = schema.validate({
        name: req.body.name,
        email: req.body.email,
        profession: req.body.profession,
        designation: req.body.designation,
        mobile: req.body.mobile,
        institute: req.body.institute,
        department: req.body.department,
        title: req.body.title,
        abstract: req.body.abstract,
    })

    if (validateResult.error) {
        return res.status(200).json({
            success: false,
            message: fromErrorMessage(validateResult.error.details[0])
        })
    }

    const reg = new model('registration')
    reg.save({
            name: validateResult.value.name,
            email: validateResult.value.email,
            profession: validateResult.value.profession,
            designation: validateResult.value.designation,
            mobile: validateResult.value.mobile,
            institute: validateResult.value.institute,
            department: validateResult.value.department,
            title: validateResult.value.title,
            abstract: validateResult.value.abstract,
        })
        .then(dataInsectionResult => {
            if (dataInsectionResult.insertedCount !== 1) {
                return res.json({
                    success: false,
                    message: 'Server error, try again later'
                })
            }

            return res.json({
                success: true,
                message: 'Successfully registration is completed.'
            })
        })
}