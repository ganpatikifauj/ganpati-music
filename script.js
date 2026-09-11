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
const plItems = document.querySelector('#plItems');

let player = null;
let ready = false;
let playing = false;
let timer = null;
let playlistIds = [];

// Real YouTube playback via the official IFrame Player API.
// The player stays visible (small thumbnail) per YouTube's Terms of Service — it is not hidden or disguised.
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player('yt', {
    width: '100%',
    height: '100%',
    playerVars: {
      listType: 'playlist',
      list: 'PLBdB2QrKw3SQ',
      autoplay: 0,
      enablejsapi: 1,
      controls: 0,
      rel: 0,
      playsinline: 1,
      origin: window.location.origin
    },
    events: {
      onReady: () => {
        ready = true;
        artist.textContent = 'Ready — Play दबाएँ';
        updateInfo();
        loadPlaylistItems();
        pollForPlaylist();
      },
      onStateChange: (e) => {
        playing = e.data === YT.PlayerState.PLAYING;
        playBtn.textContent = playing ? '❚❚' : '▶';
        if (playing) startProgress(); else stopProgress();
        updateInfo();
        highlightActive();
        if (!playlistIds.length) loadPlaylistItems();
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

// Build the real, playable song list from the loaded YouTube playlist.
// Titles/thumbnails come from YouTube's public oEmbed + thumbnail endpoints (no scraping, no API key needed).
async function loadPlaylistItems() {
  try {
    playlistIds = player.getPlaylist() || [];
  } catch (_) {
    playlistIds = [];
  }
  if (!playlistIds.length) {
    plItems.innerHTML = '<p class="pl-loading">Playlist load nahi ho payi</p>';
    return;
  }

  plItems.innerHTML = '';
  playlistIds.forEach((id, i) => {
    const row = document.createElement('div');
    row.className = 'pl-item';
    row.dataset.index = i;
    row.innerHTML = `
      <span class="plnum">${i + 1}</span>
      <img src="https://img.youtube.com/vi/${id}/mqdefault.jpg" alt="">
      <div class="pltxt"><b>Loading…</b><span>&nbsp;</span></div>`;
    row.onclick = () => {
      player.playVideoAt(i);
      playing = true;
      playBtn.textContent = '❚❚';
    };
    plItems.appendChild(row);

    // Fetch real title/channel name for this track (public oEmbed endpoint).
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
      .then(r => r.ok ? r.json() : null)
      .then(info => {
        if (!info) return;
        const b = row.querySelector('.pltxt b');
        const span = row.querySelector('.pltxt span');
        if (b) b.textContent = info.title || `Track ${i + 1}`;
        if (span) span.textContent = info.author_name || '';
      })
      .catch(() => {
        const b = row.querySelector('.pltxt b');
        if (b) b.textContent = `Track ${i + 1}`;
      });
  });

  highlightActive();
}

function highlightActive() {
  if (!player || !ready) return;
  let idx = 0;
  try { idx = player.getPlaylistIndex(); } catch (_) {}
  document.querySelectorAll('.pl-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.index) === idx);
  });
}

// YouTube sometimes needs a moment before getPlaylist() returns real data — retry quickly a few times.
function pollForPlaylist(tries = 0) {
  if (playlistIds.length || tries > 15) return;
  setTimeout(() => {
    loadPlaylistItems();
    pollForPlaylist(tries + 1);
  }, 300);
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

listBtn.onclick = () => {
  playlist.classList.toggle('open');
  if (playlist.classList.contains('open') && !playlistIds.length && ready) {
    loadPlaylistItems();
  }
};
closeList.onclick = () => playlist.classList.remove('open');

loadYouTubeAPI();
