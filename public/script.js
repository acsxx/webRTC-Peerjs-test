const socket = io("/")
const videoGrid = document.getElementById("video-grid");

var peer = new Peer(undefined, {
    host: "/",
    port: "3001"
});

const myVideo = document.createElement("video");

let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video : true,
    audio : true
}).then(stream => {

    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", call =>{
        call.answer(stream)
        const video = document.createElement("video")
        call.on("stream", userVideoStream =>{
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on("user-connected", (userId) =>{
        console.log("User Connected "+ userId)
        connectToNewUser(userId, stream);
    })
})

peer.on("open", id =>{
    socket.emit("join-room", ROOM_ID, id);
    console.log("my UserId " + id);
})


function connectToNewUser(userId, stream){
    const call = peer.call(userId, stream)
    const video = document.createElement("video")
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on("close", () =>{
        video.remove()
    })

}

function addVideoStream(video, stream){
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () =>{
        video.play();
    })
    videoGrid.append(video);
}

let text = $("input");
$("html").keydown((e) =>{
    if(e.which == 13 && text.val().length !== 0) {
        //console.log(text.val())
        socket.emit("message", text.val());
        text.val("");
    }
})

socket.on("createMessage", (message,userId) =>{
    //console.log("this is coming from server", message);
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
})

function scrollToBottom(){
    let d = $(".mainChatWindow")
    d.scrollTop(d.prop("scrollHeight"))
}

function muteUnmute(){
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

function setMuteButton(){
    const html = `<i class="fas fa-microphone"></i>
    <span>Mute</span>`
    document.querySelector(".mainMuteButton").innerHTML =  html;
}

function setUnmuteButton(){
    const html = `<i class="unMute fas fa-microphone-slash"></i>
    <span>Unmute</span>`
    document.querySelector(".mainMuteButton").innerHTML =  html;
}

function playStop(){
    let enabled = myVideoStream.getVideoTracks()[0].enabled
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false
        setPlayVideo()
    }
    else{
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true
    }
}

function setPlayVideo(){
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.querySelector(".mainVideoButton").innerHTML = html
}

function setStopVideo(){
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
    `
    document.querySelector(".mainVideoButton").innerHTML = html
}
