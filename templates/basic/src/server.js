const fs = require("fs");
const Path = require("path")

const { Server, logger } = require("@desaubv/quik");

const config = require("./config.json");
require("./logger");

const server = Server();
const validExtensions = [".js", ".ts"];

/* Auto Load routes */
let routesMap = {};
try {
    const basePath = "./src/routes";
    routesMap = loadRouteDir(basePath, config.api?.prefix);
    if (Object.keys(routesMap).length === 0) {
        logger.warning(`No routes found to load in ${basePath}.`);
    }
} catch (err) {
    if (err instanceof Error && "code" in err) {
        switch (err.code) {
            case "ENOENT":
                logger.error("[ Routes dir not found ]:", err.message);
                break;

            case "EACCES":
                logger.error("[ Permission denied ]:", err.message);
                break;

            default:
                logger.error("[ Error loading routes ]:", err.message);
        }
    } else {
        logger.error(err);
    }
}

for (const key in routesMap) {
    const router = routesMap[key];

    try {
        server.addRoute(key, router);
    }catch(err) {
        logger.error("[ Error adding router ]", err.message);
    }
}

/* Auto load Cron */
let cronMap = [];
try {
    const basePath = "./src/cron";
    cronMap = loadCronDir(basePath);
    
} catch (err) {
    if (err instanceof Error && "code" in err) {
        switch (err.code) {
            case "ENOENT":
                logger.error("[ Cron dir not found ]:", err.message);
                break;

            case "EACCES":
                logger.error("[ Permission denied ]:", err.message);
                break;

            default:
                logger.error("[ Error loading cron ]:", err.message);
        }
    } else {
        logger.error(err);
    }
}

for (const i in cronMap) {
    const cron = cronMap[i];
    
    try {
        server.addCron(cron);
    }catch(err) {
        logger.error("[ Error adding cron ]", err.message);
    }
}

/* Static html */
const staticPath = config.server.static;
if(staticPath){
    server.addStaticDir(staticPath);
}

// Load config
server.setConfig({
    ...config.server,
    language: config.app.language
});

module.exports = server;

/* Funciones auxiliares */
// Auto Load routes
function loadRouteDir(basePath, base = "") {
    let routesMap = {};
    const routes = fs.readdirSync(basePath);
    base = base == "" ? base : `${base}/`;

    routes.forEach((route) => {
        const path = Path.resolve(basePath, route);
        const stats = fs.statSync(path);
        const ext = Path.extname(path);
        const basename = Path.parse(path).name;

        if (stats.isDirectory()) {
            let routesInDir = loadRouteDir(path, base + route);
            routesMap = {
                ...routesMap,
                ...routesInDir
            }
        }

        if (!validExtensions.includes(ext)) {
            return
        }
        
        const key = basename.toLocaleLowerCase() == "default" 
                        ? base + "" 
                        : base + basename;
        routesMap[key] = require(path);
    });

    return routesMap;
}

// Auto load Cron
function loadCronDir(basePath) {
    let cronMap = [];
    const routes = fs.readdirSync(basePath);

    routes.forEach((route) => {
        const path = Path.resolve(basePath, route);
        const stats = fs.statSync(path);
        const ext = Path.extname(path);

        if (stats.isDirectory()) {
            let cronsInDir = loadCronDir(path);
            cronMap.push(...cronsInDir);
        }

        if (!validExtensions.includes(ext)) {
            return
        }
        
        cronMap.push(require(path));
    });

    return cronMap;
}