const express = require("express");
const { Socket } = require("socket.io");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server)
const { v4: uuidV4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set("view engine","ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get("/:room", (req, res) => {
    res.render("room",{ roomId: req.params.room});
})

io.on("connection", socket => {
    socket.on("join-room", (roomId, userId) =>{
       // console.log("JOINED ROOM "+ `${uuidV4()}`)
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId)
        socket.on("message", (message,userId) =>{
            io.to(roomId, userId).emit("createMessage", message, userId)
        })

    })
})

server.listen(process.env.Port || 3000);