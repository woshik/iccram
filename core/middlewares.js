exports.CanSee = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.redirect(web.userDashboard.url)
    } else {
        next()
    }
}

exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect(web.login.url)
    }
}