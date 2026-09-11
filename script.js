const songs = [
  {name:"Ganpati Bappa Morya", file:"songs/song1.mp3"},
  {name:"Deva Shree Ganesha", file:"songs/song2.mp3"},
  {name:"Morya Morya", file:"songs/song3.mp3"},
  {name:"Ganpati DJ Remix", file:"songs/song4.mp3"},
  {name:"Ganpati Bappa Morya (Dhol Mix)", file:"songs/song5.mp3"},
  {name:"Jai Dev Jai Dev", file:"songs/song6.mp3"}
];

const audio=document.getElementById("audio"), play=document.getElementById("play");
const title=document.getElementById("songTitle"), list=document.getElementById("list");
const bar=document.getElementById("bar"), current=document.getElementById("current"), duration=document.getElementById("duration");
let index=0;

function fmt(s){if(!isFinite(s))return"0:00";let m=Math.floor(s/60),sec=Math.floor(s%60).toString().padStart(2,"0");return`${m}:${sec}`}
function load(i){index=(i+songs.length)%songs.length;audio.src=songs[index].file;title.textContent=songs[index].name;render()}
function render(){list.innerHTML=songs.map((s,i)=>`<div class="track ${i===index?"active":""}" data-i="${i}"><span class="num">${i+1}</span><span class="name">${s.name}</span><small>▶</small></div>`).join("");list.querySelectorAll(".track").forEach(x=>x.onclick=()=>{load(+x.dataset.i);audio.play().catch(()=>{});play.textContent="⏸"})}
function toggle(){if(audio.paused){audio.play().catch(()=>{});play.textContent="⏸"}else{audio.pause();play.textContent="▶"}}
play.onclick=toggle; document.getElementById("start").onclick=()=>{if(!audio.src)load(0);audio.play().catch(()=>{});play.textContent="⏸"};
document.getElementById("prev").onclick=()=>{load(index-1);audio.play().catch(()=>{});play.textContent="⏸"};
document.getElementById("next").onclick=()=>{load(index+1);audio.play().catch(()=>{});play.textContent="⏸"};
document.getElementById("volume").oninput=e=>audio.volume=e.target.value;
audio.addEventListener("loadedmetadata",()=>duration.textContent=fmt(audio.duration));
audio.addEventListener("timeupdate",()=>{current.textContent=fmt(audio.currentTime);bar.style.width=(audio.currentTime/audio.duration*100||0)+"%"});
audio.addEventListener("ended",()=>{load(index+1);audio.play().catch(()=>{})});
load(0); audio.volume=.9;
