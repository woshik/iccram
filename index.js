"use strict";

const cluster = require("cluster")

if (cluster.isMaster) {
    let numCPUs = require('os').cpus().length
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            NODE_ENV: "production"
        })
    }

    cluster.on('exit', (worker) => {
        cluster.fork({
            NODE_ENV: "production"
        })
    })
} else {
    //global declaration
    global.join = require("path").join;
    global.BASE_DIR = __dirname;

    require(join(BASE_DIR, 'app', 'bootstrap'))
}