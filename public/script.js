
const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video')
myVideo.classList.add("col-lg-4")
myVideo.classList.add("col-md-6")
myVideo.classList.add("col-sm-12")
myVideo.muted = true;
//just added....
const peers = {}

var peer = new Peer(undefined, {
    path: '/peerjs', 
    host: '/',
    port: '443'
});
 
let myVideoStream
navigator.mediaDevices.getUserMedia({
    video: true, 
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        video.classList.add("col-lg-4")
        video.classList.add("col-md-6")
        video.classList.add("col-sm-12")
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', (userId) => {
        connectToNewUser(userId, stream);
    }) 
})

//just added....
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

peer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id);
})


const connectToNewUser = (userId, stream) => {
    const call = peer.call(userId, stream)
    const video = document.createElement('video')
    video.classList.add("col-lg-4")
    video.classList.add("col-md-6")
    video.classList.add("col-sm-12")
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
}

const addVideoStream = (video, stream) =>{
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=> {
        video.play();
    })
    videoGrid.append(video);
}   

let text = $('input')
console.log(text)

$('html').keydown((e) => {
    if (e.which == 13 && text.val().length !==0) {
        console.log(text.val())
        socket.emit('message', text.val());
        text.val('')
    }
})

socket.on('createMessage', message => {
  $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
})

const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }
  
  
  const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setUnmuteButton();
    } else {
      setMuteButton();
      myVideoStream.getAudioTracks()[0].enabled = true;
    }
  }
  
  const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }
  
  const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i> <br/>
      <span>Mute</span>
    `
    document.querySelector('#main__mute_button').innerHTML = html;
  }
  
  const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i> <br/>
      <span>Unmute</span>
    `
    document.querySelector('#main__mute_button').innerHTML = html;
  }
  
  const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i> <br/>
      <span>Stop Video</span>
    `
    document.querySelector('#main__video_button').innerHTML = html;
  }
  
  const setPlayVideo = () => {
    const html = `
    <i class="stop fas fa-video-slash"></i> <br/>
      <span>Play Video</span>
    `
    document.querySelector('#main__video_button').innerHTML = html;
  }
  
  //Meeting ID popUp
  $(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
  });

  //Back Button Function
  function goBack() {
    window.history.back();
  }
  
  const targetDiv = document.getElementById("right");
  const showHide = () => {
    if (targetDiv.style.display !== "none") {
      targetDiv.style.display= "none";
    } else {
      targetDiv.style.display = "block";
    }
  };

