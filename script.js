const bell=document.querySelector("#bell");const listBtn=document.querySelector("#listBtn");const playlist=document.querySelector("#playlist");const closeList=document.querySelector("#closeList");const yt=document.querySelector("#yt");const play=document.querySelector("#play");let playing=false;

function ring(){const a=new Audio("temple-bell.mp3");a.play().catch(()=>{});bell.animate([{transform:"rotate(-10deg)"},{transform:"rotate(10deg)"},{transform:"rotate(0)"}],{duration:450})}
bell.onclick=ring;
listBtn.onclick=()=>playlist.classList.toggle("open");
closeList.onclick=()=>playlist.classList.remove("open");

play.onclick=()=>{playing=!playing;play.textContent=playing?"❚❚":"▶";if(playing){yt.focus();}};
document.querySelector("#prev").onclick=()=>window.open("https://music.youtube.com/playlist?list=PLBdB2QrKw3SQ","_blank");
document.querySelector("#next").onclick=()=>window.open("https://music.youtube.com/playlist?list=PLBdB2QrKw3SQ","_blank");
