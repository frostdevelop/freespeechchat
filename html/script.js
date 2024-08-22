var socket;
var usernameInput
var chatIDInput;
var messageInput;
var pfpInput;
var chatRoom;
var messages = [];
var users = [];
var delay = true;
var system;
var chat;
var online;
var typing = false;
var typingtimeout;

function onload(){
  socket = io();
  usernameInput = document.getElementById("NameInput");
  chatIDInput = document.getElementById("IDInput");
  messageInput = document.getElementById("ComposedMessage");
  chatRoom = document.getElementById("RoomID");
  system = new sys(document.getElementById("System"));
  chat = document.getElementById("Chat");
  pfpInput = document.getElementById("PfpInput");

  socket.on("join", function(room){
    chatRoom.innerHTML = "Chatroom : " + room;
  })

  socket.on("recieve", function(type, message, user, pfp){
    console.log(message);
    if(type === "normal"){
      system.playId("Notify");
    }
    else if(type === "connect"){
      system.playId("Connect");
    }
    else if(type === "disconnect"){
      system.playId("Disconnect");
    }
    else if(type === "r"){
      system.playId("R");
    }
    else if(type === "s"){
      system.playId("S");
    }
    /*
    if (messages.length < 9){
      messages.push(message);
      dingSound.currentTime = 0;
      dingSound.play();
    }
    else{
      messages.shift();
      messages.push(message);
    }
    for (i = 0; i < messages.length; i++){
        document.getElementById("Message"+i).innerHTML = messages[i];
        document.getElementById("Message"+i).style.color = "#ffffff";
        document.getElementById("User"+i).innerHTML = user;
        document.getElementById("User"+i).style.color = "#ffffff";
    }
    */
    let messageElm = document.createElement("div");
    messageElm.className = "Message";
    let userElm = document.createElement("div");
    userElm.className = "User";
    userElm.innerHTML = user;
    let pfpElm = document.createElement("img");
    pfpElm.className = "pfp";
    pfpElm.setAttribute("alt", "Profile Picture of " + user);
    pfpElm.src = pfp;
    let messageText = document.createElement("div");
    messageText.className = "Body";
    messageText.appendChild(document.createTextNode(message));
    messageElm.appendChild(pfpElm);
    messageElm.appendChild(userElm);
    messageElm.appendChild(messageText);
    chat.appendChild(messageElm);
    messageElm.scrollIntoView();
  })

  socket.on("usernames", (usernames)=>{
    console.log("usernames:");
    online = usernames;
    for(i = 0; i < usernames.length; i++){
      console.log(usernames[i]);
    }
  })

  socket.on("dialog", (msg)=>{
    system.dialog(msg);
  });
  
  window.onbeforeunload = () => {
    socket.emit("disconnect");
    return 'Are you sure you want to disconnect?';
  }
  
  messageInput.addEventListener("keydown", (key) => {
    if(typeof(typingtimeout) != 'undefined' || typingtimeout != null){
      clearTimeout(typingtimeout);
    };
    console.log("Typing...");
    typing = true;
    typingtimeout = setTimeout(()=>{
      console.log("Typing Stopped...");
      typing = false;
    }, 5000);
    if (key.key === "Enter" && !(key.shiftKey)) {
      key.preventDefault();
      console.log("Typing Stopped...");
      typing = false;
      if(typeof(typingtimeout) != 'undefined' || typingtimeout != null){
        clearTimeout(typingtimeout);
      };
      Send();
    }
    else if (key.key === "Enter" && key.shiftKey) {
        messageInput.rows = messageInput.value.split(/\r*\n/).length + 1;
        messageInput.scrollIntoView();
    }
  })
  messageInput.addEventListener("keyup", (key) => {
    if (key.key === "Backspace" || key.key === "Delete") {
        messageInput.rows = messageInput.value.split(/\r*\n/).length;
    }
  })

  system.dialog("Messages are not stored on our server or encrypted. Reloading causes message history to be cleared.", "Disclaimer", true);
}

function Connect(){
  if (usernameInput.value.length > 0){
    system.playId("Connecting");
    system.toastinfo("Connecting to chatroom: " + chatIDInput.value);
    socket.emit("join", chatIDInput.value, usernameInput.value, pfpInput.value);
  }
  else {
    system.dialog("Please enter a username");
  }
}

function Send(){
  typing = false;
  if (delay && messageInput.value.replace(/\s/g, "") != ""){
    let message = messageInput.value.replaceAll("\n", "<br/>");
    delay = false;
    setTimeout(delayReset, 500);
    socket.emit("send", message);
    messageInput.rows = 1;
    document.getElementById("resetmsg").click();
  }
}

function delayReset(){
  delay = true;
}