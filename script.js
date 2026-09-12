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

let playing = false;
let timer = null;
let currentIndex = 0;

const tracks = [
  { src: 'songs/song1.mp3', title: 'Song 1', artist: 'Local Recording' },
  { src: 'songs/song2.mp3', title: 'Song 2', artist: 'Local Recording' },
  { src: 'songs/song3.mp3', title: 'Song 3', artist: 'Local Recording' },
  { src: 'songs/song4.mp3', title: 'Song 4', artist: 'Local Recording' },
  { src: 'songs/song5.mp3', title: 'Song 5', artist: 'Local Recording' },
  { src: 'songs/song6.mp3', title: 'Song 6', artist: 'Local Recording' }
];

const audio = new Audio();
audio.preload = 'metadata';

function fmt(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function updateInfo() {
  const t = tracks[currentIndex];
  title.textContent = t.title;
  artist.textContent = t.artist;
  currentTime.textContent = fmt(audio.currentTime);
  const d = audio.duration || 0;
  progress.style.width = d ? `${Math.min(100, audio.currentTime / d * 100)}%` : '0%';
}

function loadTrack(index, autoplay = false) {
  currentIndex = (index + tracks.length) % tracks.length;
  const t = tracks[currentIndex];
  audio.src = t.src;
  audio.load();
  title.textContent = t.title;
  artist.textContent = 'Loading…';
  currentTime.textContent = '0:00';
  progress.style.width = '0%';
  highlightActive();

  if (autoplay) {
    audio.play().catch(() => {
      artist.textContent = 'Play दबाएँ';
    });
  }
}

function buildPlaylist() {
  if (!plItems) return;
  plItems.innerHTML = '';
  tracks.forEach((t, i) => {
    const row = document.createElement('div');
    row.className = 'pl-item';
    row.dataset.index = i;
    row.innerHTML = `
      <span class="plnum">${i + 1}</span>
      <div class="pltxt"><b>${t.title}</b><span>${t.artist}</span></div>`;
    row.onclick = () => {
      loadTrack(i, true);
      if (playlist) playlist.classList.remove('open');
    };
    plItems.appendChild(row);
  });
  highlightActive();
}

function highlightActive() {
  document.querySelectorAll('.pl-item').forEach(el => {
    el.classList.toggle('active', Number(el.dataset.index) === currentIndex);
  });
}

audio.addEventListener('loadedmetadata', () => {
  artist.textContent = tracks[currentIndex].artist;
  updateInfo();
});

audio.addEventListener('timeupdate', updateInfo);

audio.addEventListener('play', () => {
  playing = true;
  playBtn.textContent = '❚❚';
  artist.textContent = tracks[currentIndex].artist;
  startProgress();
});

audio.addEventListener('pause', () => {
  playing = false;
  playBtn.textContent = '▶';
  stopProgress();
});

audio.addEventListener('ended', () => {
  if (currentIndex < tracks.length - 1) {
    loadTrack(currentIndex + 1, true);
  } else {
    loadTrack(0, false);
  }
});

audio.addEventListener('error', () => {
  playing = false;
  playBtn.textContent = '▶';
  artist.textContent = 'Audio file load nahi hui';
});

function startProgress() {
  stopProgress();
  timer = setInterval(updateInfo, 500);
}
function stopProgress() {
  if (timer) clearInterval(timer);
  timer = null;
}

// Click or drag on the progress bar to seek.
const barEl = document.querySelector('.bar');
let dragging = false;

function seekFromEvent(e) {
  const rect = barEl.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let ratio = (clientX - rect.left) / rect.width;
  ratio = Math.min(1, Math.max(0, ratio));
  const d = audio.duration || 0;
  if (!d) return;
  audio.currentTime = ratio * d;
  updateInfo();
}

if (barEl) {
  barEl.addEventListener('mousedown', e => { dragging = true; seekFromEvent(e); });
  window.addEventListener('mousemove', e => { if (dragging) seekFromEvent(e); });
  window.addEventListener('mouseup', () => { dragging = false; });
  barEl.addEventListener('touchstart', e => { dragging = true; seekFromEvent(e); }, {passive:true});
  window.addEventListener('touchmove', e => { if (dragging) seekFromEvent(e); }, {passive:true});
  window.addEventListener('touchend', () => { dragging = false; });
}

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play().catch(() => { artist.textContent = 'Play दबाएँ'; });
  } else {
    audio.pause();
  }
};

prevBtn.onclick = () => {
  loadTrack(currentIndex - 1, true);
};

nextBtn.onclick = () => {
  loadTrack(currentIndex + 1, true);
};

if (bell) {
  bell.onclick = () => {
    const a = new Audio('temple-bell.mp3');
    a.play().catch(() => {});
    bell.animate(
      [{ transform: 'rotate(-12deg)' }, { transform: 'rotate(12deg)' }, { transform: 'rotate(0)' }],
      { duration: 450 }
    );
  };
}

if (listBtn && playlist) {
  listBtn.onclick = () => playlist.classList.toggle('open');
}
if (closeList && playlist) {
  closeList.onclick = () => playlist.classList.remove('open');
}

// Remove the old YouTube player/credit if the HTML still contains them.
document.querySelectorAll('.ytbox, .yt-credit').forEach(el => el.remove());

buildPlaylist();
loadTrack(0, false);
