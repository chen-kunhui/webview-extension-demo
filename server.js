const { Server } = require("socket.io")
const io = new Server({});

io.on("connection", (socket) => {
    console.log("有链接============", socket.id)
    socket.on('howdy', (arg) => {
        console.log("=============", arg)
    })
});

io.listen(3000);