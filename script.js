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

let player = null;
let ready = false;
let playing = false;
let timer = null;

// Real YouTube playback, but the video surface stays hidden so the site behaves like an audio player.
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt', {
    width: '1',
    height: '1',
    playerVars: {
      listType: 'playlist',
      list: 'PLBdB2QrKw3SQ',
      autoplay: 0,
      controls: 0,
      rel: 0,
      playsinline: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        ready = true;
        updateInfo();
      },
      onStateChange: (e) => {
        playing = e.data === YT.PlayerState.PLAYING;
        playBtn.textContent = playing ? '❚❚' : '▶';
        if (playing) startProgress(); else stopProgress();
        updateInfo();
      },
      onError: () => {
        artist.textContent = 'YouTube song unavailable';
      }
    }
  });
};

function loadYouTubeAPI() {
  if (document.querySelector('script[data-youtube-api]')) return;
  const s = document.createElement('script');
  s.src = 'https://www.youtube.com/iframe_api';
  s.dataset.youtubeApi = '1';
  document.head.appendChild(s);
}

function updateInfo() {
  if (!player || !ready) return;
  try {
    const data = player.getVideoData();
    if (data && data.title) title.textContent = data.title;
    if (data && data.author) artist.textContent = data.author;
  } catch (_) {}
}

function fmt(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function startProgress() {
  stopProgress();
  timer = setInterval(() => {
    if (!player || !ready) return;
    const d = player.getDuration() || 0;
    const t = player.getCurrentTime() || 0;
    currentTime.textContent = fmt(t);
    progress.style.width = d ? `${Math.min(100, t / d * 100)}%` : '0%';
  }, 500);
}
function stopProgress() {
  if (timer) clearInterval(timer);
  timer = null;
}

playBtn.onclick = () => {
  if (!ready) {
    loadYouTubeAPI();
    artist.textContent = 'Loading songs…';
    return;
  }
  if (player.getPlayerState() === YT.PlayerState.PLAYING) player.pauseVideo();
  else player.playVideo();
};

prevBtn.onclick = () => { if (ready) player.previousVideo(); };
nextBtn.onclick = () => { if (ready) player.nextVideo(); };

bell.onclick = () => {
  const a = new Audio('temple-bell.mp3');
  a.play().catch(() => {});
  bell.animate(
    [{ transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }],
    { duration: 450 }
  );
};

listBtn.onclick = () => playlist.classList.toggle('open');
closeList.onclick = () => playlist.classList.remove('open');

loadYouTubeAPI();
