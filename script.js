const bell = document.querySelector('#bell');
const listBtn = document.querySelector('#listBtn');
const playlist = document.querySelector('#playlist');
const closeList = document.querySelector('#closeList');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const title = document.querySelector('#title');
const artist = document.querySelector('#artist');
const progress = document.querySelector('.bar span');
const currentTime = document.querySelector('.times span:first-child');

const PLAYLIST_ID = 'PLBdB2QrKw3SQ';
let player = null;
let ready = false;
let timer = null;

function setStatus(text){ artist.textContent = text; }

// YouTube requires a real player surface (at least 200x200). The CSS keeps
// this surface visually out of the design while the official player still
// supplies the audio and playback state.
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt', {
    width: '200',
    height: '200',
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      controls: 0,
      rel: 0,
      playsinline: 1,
      modestbranding: 1,
      origin: window.location.origin
    },
    events: {
      onReady: function () {
        ready = true;
        try { player.setLoop(false); } catch(e) {}
        setStatus('Ready — Play दबाएँ');
        updateInfo();
      },
      onStateChange: function (e) {
        const isPlaying = e.data === YT.PlayerState.PLAYING;
        playBtn.textContent = isPlaying ? '❚❚' : '▶';
        if (isPlaying) startProgress(); else stopProgress();
        updateInfo();
      },
      onError: function (e) {
        playBtn.textContent = '▶';
        const messages = {2:'YouTube video ID error',5:'YouTube HTML5 player error',100:'Song unavailable',101:'Song cannot be embedded',150:'Song cannot be embedded'};
        setStatus(messages[e.data] || 'YouTube playback unavailable');
      }
    }
  });
};

function loadYouTubeAPI(){
  if (window.YT && window.YT.Player) {
    window.onYouTubeIframeAPIReady();
    return;
  }
  if (document.querySelector('script[data-youtube-api]')) return;
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.async = true;
  s.dataset.youtubeApi = '1';
  document.head.appendChild(s);
}

function updateInfo(){
  if(!player || !ready) return;
  try{
    const data = player.getVideoData();
    if(data?.title) title.textContent = data.title;
    if(data?.author) artist.textContent = data.author;
  }catch(e){}
}

function fmt(sec){
  sec = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
}

function startProgress(){
  stopProgress();
  timer = setInterval(()=>{
    if(!player || !ready) return;
    const d = player.getDuration() || 0;
    const t = player.getCurrentTime() || 0;
    currentTime.textContent = fmt(t);
    progress.style.width = d ? `${Math.min(100,(t/d)*100)}%` : '0%';
  },500);
}
function stopProgress(){ if(timer){clearInterval(timer);timer=null;} }

playBtn.addEventListener('click', ()=>{
  if(!ready){ setStatus('Loading songs…'); loadYouTubeAPI(); return; }
  try{
    const state = player.getPlayerState();
    if(state === YT.PlayerState.PLAYING) player.pauseVideo();
    else player.playVideo();
  }catch(e){ setStatus('YouTube playback unavailable'); }
});

prevBtn.addEventListener('click', ()=>{ if(ready) player.previousVideo(); });
nextBtn.addEventListener('click', ()=>{ if(ready) player.nextVideo(); });

bell.addEventListener('click', ()=>{
  const a = new Audio('temple-bell.mp3');
  a.play().catch(()=>{});
  bell.animate([{transform:'rotate(-12deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}],{duration:450});
});

listBtn.addEventListener('click', ()=>playlist.classList.toggle('open'));
closeList.addEventListener('click', ()=>playlist.classList.remove('open'));

loadYouTubeAPI();
