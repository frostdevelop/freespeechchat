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
    alertimg.innerHTML = `
    <svg height="100px" viewBox="-1 -2.5 29 29" stroke="currentcolor"  xmlns="http://www.w3.org/2000/svg" fill="none" stroke-width="0">
<g>
<path d="M12.5124 1.57143C12.9513 0.809523 14.0487 0.809524 14.4876 1.57143L25.8455 21.2857C26.2845 22.0476 25.7358 23 24.8579 23H2.14213C1.26423 23 0.715539 22.0476 1.15449 21.2857L12.5124 1.57143Z" stroke-width="1.5"/>
<path d="M13.5 17.5C13.0534 17.5 12.7762 17.191 12.75 16.7953L12.25 6.83333C12.1993 6.06874 12.637 5.5 13.5 5.5C14.363 5.5 14.8007 6.06874 14.75 6.83333L14.25 16.7953C14.2238 17.191 13.9466 17.5 13.5 17.5Z" fill="currentcolor"/>
<path d="M12.375 19.625C12.375 19.0037 12.8787 18.5 13.5 18.5C14.1213 18.5 14.625 19.0037 14.625 19.625C14.625 20.2463 14.1213 20.75 13.5 20.75C12.8787 20.75 12.375 20.2463 12.375 19.625Z" fill="currentcolor"/>
</g>
</svg>`;
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