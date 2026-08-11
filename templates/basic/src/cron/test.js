const { Cron, Schedule } = require("@desaubv/quik/cron");
const cron = Cron();

// Configuration
cron.setConfig({
    language: "es",
    timeZone: "America/Mexico_City",
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
