const { CanSee, isAuthenticated } = require(join(BASE_DIR, "core", "middlewares"))

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
            registration: 'post',
        },
        middleware: [],
        path: 'visitor'
    },

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////// Admin //////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    login: {
        url: '/login',
        controller: 'Login',
        methods: {
            loginView: 'get',
            login: 'post'
        },
        middleware: [CanSee],
        path: 'auth'
    },

    dashboard: {
        url: '/admin',
        controller: 'Dashboard',
        methods: {
            dashboardView: 'get',
        },
        middleware: [isAuthenticated],
        path: 'admin'
    },

    setting: {
        url: '/profile-setting',
        controller: 'Dashboard',
        methods: {
            profileSetting: 'post',
        },
        middleware: [isAuthenticated],
        path: 'admin'
    },

    logout: {
        url: '/logout',
        controller: 'Dashboard',
        methods: {
            logout: 'get',
        },
        middleware: [isAuthenticated],
        path: 'admin'
    },

    regList: {
        url: '/registration-list',
        controller: 'Registration',
        methods: {
            regListView: 'get',
            regList: 'post'
        },
        middleware: [isAuthenticated],
        path: 'admin'
    }
}