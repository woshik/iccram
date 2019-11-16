const Joi = require('@hapi/joi')
const Entities = require('html-entities').AllHtmlEntities
const dateTime = require('date-and-time')
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

    const entities = new Entities()
    const reg = new model('registration')
    reg.save({
            name: entities.encode(validateResult.value.name),
            email: entities.encode(validateResult.value.email),
            profession: entities.encode(validateResult.value.profession),
            designation: entities.encode(validateResult.value.designation),
            mobile: entities.encode(validateResult.value.mobile),
            institute: entities.encode(validateResult.value.institute),
            department: entities.encode(validateResult.value.department),
            title: entities.encode(validateResult.value.title),
            abstract: entities.encode(validateResult.value.abstract),
            registration_time: dateTime.format(dateTime.addHours(new Date(), 6), "DD-MM-YYYY hh:mm:ss A")
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