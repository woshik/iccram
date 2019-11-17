"use strict";

exports.committeeView = (req, res, next) => {
    res.render("visitor/committee", {
        title: 'Committee',
        homeURL: web.home.url,
        committeeURL: web.committee.url,
        registrationURL: web.registration.url
    })
}