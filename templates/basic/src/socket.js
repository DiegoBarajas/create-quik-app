const { Socket } = require("@desaubv/quik/ws");

const ws = Socket();

// Events
ws.addEvent("ping", (socket) => {
    console.log("Ping");
    
    socket.emit("pong");
});


ws.onConnect((socket) => {
    console.log("New client from handler: ", socket.id);
})

ws.onDisconnect((socket) => {
    console.log("Client disconnected: ", socket.id);
})

module.exports = ws;