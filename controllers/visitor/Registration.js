exports.registrationView = (req, res, next) => {
    res.render("visitor/registration", {
        title: 'Registration',
        homeURL: web.home.url,
        committeeURL: web.committee.url,
        registrationURL: web.registration.url
    })
}