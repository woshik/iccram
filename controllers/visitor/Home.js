exports.homeView = (req, res, next) => {
    res.render("visitor/home", {
        title: 'Home',
        homeURL: web.home.url,
        committeeURL: web.committee.url,
        registrationURL: web.registration.url
    })
}