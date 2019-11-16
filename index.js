const cluster = require("cluster")

if (cluster.isMaster) {
    let env = "development"
    if (process.env.NODE_ENV === "production") {
        env = "production"
        cluster.on('exit', (worker) => {
            cluster.fork({
                NODE_ENV: env
            })
        })
    }

    let numCPUs = require('os').cpus().length
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            NODE_ENV: env
        })
    }

} else {
    //global declaration
    global.join = require("path").join;
    global.BASE_DIR = __dirname;

    require(join(BASE_DIR, 'app', 'bootstrap'))
}