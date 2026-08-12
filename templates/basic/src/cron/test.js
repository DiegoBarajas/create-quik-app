const { logger } = require("@desaubv/quik");
const { Cron, Schedule } = require("@desaubv/quik/cron");
const cron = Cron();

const handleError = (error) => {
    logger.error("[ CRON ]",error.message);
}

// Configuration
cron.setConfig({
    language: "es",
    timeZone: "America/Mexico_City",
    onError: handleError
});

// Tasks
cron.add({
    name: "backup",
    schedule: Schedule.weekdaysAt("23:00"),

    task: async () => {
        console.log("Ejecutando backup...");
    },
});

cron.add({
    name: "los-angeles-task",
    schedule: "0 12 * * *",
    timezone: "America/Los_Angeles",

    task: async () => {
        console.log("Ejecutando tarea de Los Ángeles...");
    },
});

module.exports = cron;
