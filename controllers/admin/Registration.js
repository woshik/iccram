"use strict";

const { ObjectId } = require('mongodb')

exports.regListView = (req, res, next) => {
    res.render("admin/reg-list", {
        title: 'Registration List',
        email: req.user.email,
        sidebar: sideBar,
        csrfToken: req.csrfToken(),
        path: req.path,
        regListURL: web.regList.url,
        regDeleteURL: web.regDelete.url,
        regShowURL: web.regShow.url,
    })
}

exports.regList = (req, res, next) => {
    const reg = new model("registration")
    let order = ['name', 'email', 'mobile', 'institute', 'department', 'profession', 'designation', '', 'registration_time']
    let sort = {}

    if (req.body.order) {
        sort[order[parseInt(req.body.order[0].column)]] = req.body.order[0].dir === 'asc' ? 1 : -1
    } else {
        sort[order[0]] = 1
    }

    reg.dataTable({
            '$or': [
                { name: RegExp(`.*${req.body.search.value}.*`, 'i') },
                { email: RegExp(`.*${req.body.search.value}.*`, 'i') },
                { mobile: RegExp(`.*${req.body.search.value}.*`, 'i') },
            ]
        }, { abstract: 0 }, parseInt(req.body.start), parseInt(req.body.length), sort)
        .then(result => {
            let response = []
            result.data.map((participate) => {

                let actionButton = `
                <a href="javascript:void(0)" title="Show" class="btn btn-primary btn-icon" type="button" data-toggle="modal" data-target="#regShow" onclick="regShow('${participate._id}')" data-backdrop="static">
                    <i class="far fa-eye"></i>
                </a>
                <a href="javascript:void(0)" title="Delete" class="btn btn-primary btn-icon" type="button" data-toggle="modal" data-target="#regDelete" onclick="regDelete('${participate._id}')" data-backdrop="static">
                    <i class="fas fa-trash-alt"></i>
                </a>
                `

                response.push([
                    participate.name,
                    participate.email,
                    participate.mobile,
                    participate.institute,
                    participate.department,
                    participate.profession,
                    participate.designation,
                    participate.title,
                    participate.registration_time,
                    actionButton
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

exports.regDelete = (req, res, next) => {
    try {
        var id = ObjectId(req.body.id)
    } catch (err) {
        return res.status(200).json({
            success: false,
            message: 'Please, don\'t violate the process.'
        })
    }

    let reg = new model('registration')
    reg.deleteOne({ _id: id })
        .then(result => {
            if (!result.deletedCount) {
                return res.status(200).json({
                    success: false,
                    message: 'Registration not found'
                })
            }
            return res.status(200).json({
                success: true,
                message: "Successful account is deleted"
            })
        })
        .catch(err => next(err))
}

exports.regShow = (req, res, next) => {
    try {
        var id = ObjectId(req.query.id)
    } catch (err) {
        return res.status(200).json({
            success: false,
        })
    }

    let reg = new model('registration')
    reg.findOne({ _id: id }, { _id: 0 })
        .then(result => {
            if (!result) {
                return res.status(200).json({
                    success: false,
                })
            }
            return res.status(200).json({
                success: true,
                info: result
            })
        })
        .catch(err => next(err))
}