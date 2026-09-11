const songs=[
{title:"Gajanand Vandan Karte Hain",artist:"Mukesh Bagda",id:"Sgtv44mxKdo"},
{title:"अपना दूसरा Ganpati Song",artist:"YouTube ID जोड़ें",id:""},
{title:"अपना तीसरा Ganpati Song",artist:"YouTube ID जोड़ें",id:""},
{title:"अपना चौथा Ganpati Song",artist:"YouTube ID जोड़ें",id:""}
];
let current=0;const list=document.querySelector("#list"),count=document.querySelector("#count");
function render(){count.textContent=songs.length+" Songs";list.innerHTML=songs.map((s,i)=>`<div class="song ${i==current?"active":""}" data-i="${i}"><img src="ganpati-hero.png"><div><b>${s.title}</b><small>${s.artist}</small></div><span>${s.id?"▶":"•"}</span></div>`).join("");document.querySelectorAll(".song").forEach(x=>x.onclick=()=>select(+x.dataset.i))}
function select(i){current=i;let s=songs[i];document.querySelector("#title").textContent=s.title;document.querySelector("#artist").textContent=s.artist;if(s.id)document.querySelector("#yt").src="https://www.youtube.com/embed/"+s.id+"?rel=0&autoplay=1";render()}
document.querySelector("#prev").onclick=()=>select((current-1+songs.length)%songs.length);
document.querySelector("#next").onclick=()=>select((current+1)%songs.length);
function bell(){let C=window.AudioContext||window.webkitAudioContext;if(!C)return;let c=new C(),n=c.currentTime;[0,.1,.2].forEach((d,i)=>{let o=c.createOscillator(),g=c.createGain();o.frequency.value=[620,510,430][i];g.gain.setValueAtTime(0,n+d);g.gain.linearRampToValueAtTime(.22,n+d+.03);g.gain.exponentialRampToValueAtTime(.001,n+d+1.4);o.connect(g);g.connect(c.destination);o.start(n+d);o.stop(n+d+1.5)});document.querySelectorAll(".bell").forEach(b=>b.animate([{transform:"rotate(-8deg)"},{transform:"rotate(8deg)"},{transform:"rotate(0)"}],{duration:500}));setTimeout(()=>c.close(),1800)}
document.querySelector("#bell").onclick=bell;document.querySelector("#bell2").onclick=bell;render();