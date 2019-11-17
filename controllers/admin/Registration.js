"use strict";

exports.regListView = (req, res, next) => {
    res.render("admin/reg-list", {
        title: 'Registration List',
        email: req.user.email,
        sidebar: sideBar,
        csrfToken: req.csrfToken(),
        path: req.path,
        regListURL: web.regList.url,
    })
}

exports.regList = (req, res, next) => {
    const reg = new model("registration")
    let order = ['name', 'email', 'mobile', 'profession', 'designation', '', 'registration_time']
    let sort = {}

    if (req.body.order) {
        sort[order[parseInt(req.body.order[0].column)]] = req.body.order[0].dir === 'asc' ? 1 : -1
    } else {
        sort[order[0]] = 1
    }

    reg.dataTable({}, {}, parseInt(req.body.start), parseInt(req.body.length), sort)
        .then(result => {
            let response = []
            result.data.map((participate) => {
                response.push([
                    participate.name,
                    participate.email,
                    participate.mobile,
                    participate.profession,
                    participate.designation,
                    participate.title,
                    participate.registration_time,
                ])
            })

            return res.status(200).json({
                data: response,
                recordsTotal: result.recordsTotal,
                recordsFiltered: result.recordsFiltered,
                draw: parseInt(req.body.draw),
            })
        })
        .catch(err => next(err))
}