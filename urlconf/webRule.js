module.exports = {
    home: {
        url: '/',
        controller: 'Home',
        methods: {
            homeView: 'get',
        },
        middleware: [],
        path: 'visitor'
    },
    committee: {
        url: '/committee',
        controller: 'Committee',
        methods: {
            committeeView: 'get',
        },
        middleware: [],
        path: 'visitor'
    },

    registration: {
        url: '/registration',
        controller: 'Registration',
        methods: {
            registrationView: 'get',
        },
        middleware: [],
        path: 'visitor'
    },

}