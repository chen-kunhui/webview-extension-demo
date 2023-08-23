import { Server } from "socket.io";

export class SocketApp {
    start() {
        const io = new Server({});

        io.on("connection", (socket) => {
          socket.on('howdy', (arg) => {
            console.log("=============", arg)
          })
        });
        
        io.listen(3000);
    }
}
