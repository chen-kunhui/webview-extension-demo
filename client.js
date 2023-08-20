const io = require("socket.io-client")

const socket = io("ws://localhost:3000")

socket.on('connect', () => {
    console.log("connect ==", socket.id)
})

socket.on("disconnect", () => {
    console.log("断联 -----", socket.id); // undefined
});

socket.on("hello", (arg) => {
    console.log("----, arg", arg)
})

socket.emit("howdy", "======================666")
