class sys {
  constructor(element) {
    this.system = element;
    this.popup = element.querySelector("#popup");
    this.toast = element.querySelector("#toast");
    this.audio = element.querySelector("#audio");
  }
  
  dialog(msg, header="Alert!", blur=false){
    let backdiv = document.createElement("div");
    if(blur){backdiv.classList.add("bluroverlay")}
    backdiv.classList.add("popup");
    backdiv.classList.add("fadein");
    this.popup.appendChild(backdiv);
    if(blur){this.playId("Alert")}else{this.playId("Disabled")}
    let alertdiv = document.createElement("div");
    let alertcontent = document.createElement("div");
    let alertimg = document.createElement("div");
    alertimg.innerHTML = '<svg height="100px" viewBox="-1 -2.5 29 29" stroke="currentcolor"  xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="0"><use href="#svg-alert" /></svg>';
    alertimg.className = "img hover";
    let alertheader = document.createElement("h2");
    alertheader.className = "header";
    alertheader.innerHTML = header;
    let alerttext = document.createElement("div");
    alerttext.innerHTML = msg;
    let close = document.createElement("button");
    close.className = "close";
    close.setAttribute("aria-label", "Close");
    close.addEventListener("click", () => {
      backdiv.classList.remove("fadein");
      backdiv.classList.add("fadeout");
      setTimeout(() => {
        backdiv.remove();
      }, 300);
    });
    alertdiv.appendChild(close);
    alertcontent.appendChild(alertimg);
    alertcontent.appendChild(alertheader);
    alertcontent.appendChild(alerttext);
    alertdiv.appendChild(alertcontent);
    backdiv.appendChild(alertdiv);
    alertcontent.className = "content";
    alertdiv.className = "alertpopup";
    alertdiv.classList.add("expandin");
  }

  play(url){
    let audio = document.createElement("audio");
    audio.src = url;
    audio.play().catch(e => console.log("Audio Error" + e))
  }

  playId(id){
    let audio = document.getElementById(id);
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio Error" + e))
  }

  toastinfo(msg){
    console.log(msg);
  }
}