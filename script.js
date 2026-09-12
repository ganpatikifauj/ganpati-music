// Local player for the songs stored in this GitHub Pages repository.
const SONGS = [
  { file: 'song1.mp3', title: 'Jai Ganesh Jai Ganesh Deva', artist: 'Ganpati Ki Fauj' },
  { file: 'song2.mp3', title: 'Deva Shree Ganesha', artist: 'Ganpati Ki Fauj' },
  { file: 'song3.mp3', title: 'Shendur Laal Chadhayo', artist: 'Ganpati Ki Fauj' },
  { file: 'song4.mp3', title: 'Deva Oh Deva', artist: 'Ganpati Ki Fauj' },
  { file: 'song5.mp3', title: 'Mere Ghar Mein Padharo Gajanan Ji', artist: 'Ganpati Ki Fauj' },
  { file: 'song6.mp3', title: 'Teri Jai Ho Ganesh', artist: 'Ganpati Ki Fauj' }
];

const bell = document.querySelector('#bell'), listBtn = document.querySelector('#listBtn'), playlist = document.querySelector('#playlist'), closeList = document.querySelector('#closeList'), playBtn = document.querySelector('#play'), prevBtn = document.querySelector('#prev'), nextBtn = document.querySelector('#next'), titleEl = document.querySelector('#title'), artistEl = document.querySelector('#artist'), progress = document.querySelector('.bar span'), curTime = document.querySelector('#curTime'), durTime = document.querySelector('#durTime'), plItems = document.querySelector('#plItems'), audioEl = document.querySelector('#audioEl'), barEl = document.querySelector('#bar');
let currentIndex = 0, dragging = false;
function fmt(sec) { sec = Math.max(0, Math.floor(sec || 0)); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`; }
function loadTrack(i, autoplay = false) { currentIndex = (i + SONGS.length) % SONGS.length; const song = SONGS[currentIndex]; audioEl.src = song.file; audioEl.load(); titleEl.textContent = song.title; artistEl.textContent = song.artist; progress.style.width = '0%'; curTime.textContent = '0:00'; durTime.textContent = '0:00'; renderPlaylist(); if (autoplay) audioEl.play().catch(() => {}); }
function renderPlaylist() { plItems.innerHTML = ''; SONGS.forEach((song, i) => { const row = document.createElement('div'); row.className = 'pl-item' + (i === currentIndex ? ' active' : ''); row.innerHTML = `<span class="plnum">${i + 1}</span><img src="ganpati-hero.png" alt=""><div class="pltxt"><b>${song.title}</b><span>${song.artist}</span></div>`; row.onclick = () => loadTrack(i, true); plItems.appendChild(row); }); }
playBtn.onclick = () => { if (!audioEl.src) loadTrack(currentIndex); if (audioEl.paused) audioEl.play().catch(() => {}); else audioEl.pause(); };
prevBtn.onclick = () => loadTrack(currentIndex - 1, true); nextBtn.onclick = () => loadTrack(currentIndex + 1, true);
audioEl.addEventListener('play', () => playBtn.textContent = '❚❚'); audioEl.addEventListener('pause', () => playBtn.textContent = '▶'); audioEl.addEventListener('ended', () => loadTrack(currentIndex + 1, true)); audioEl.addEventListener('loadedmetadata', () => durTime.textContent = fmt(audioEl.duration)); audioEl.addEventListener('timeupdate', () => { if (dragging) return; const d = audioEl.duration || 0; curTime.textContent = fmt(audioEl.currentTime); progress.style.width = d ? `${Math.min(100, audioEl.currentTime / d * 100)}%` : '0%'; });
function seekFromEvent(e) { const rect = barEl.getBoundingClientRect(), clientX = e.touches ? e.touches[0].clientX : e.clientX; let ratio = (clientX - rect.left) / rect.width; ratio = Math.min(1, Math.max(0, ratio)); const d = audioEl.duration || 0; if (!d) return; audioEl.currentTime = ratio * d; progress.style.width = `${ratio * 100}%`; curTime.textContent = fmt(ratio * d); }
barEl.addEventListener('mousedown', e => { dragging = true; seekFromEvent(e); }); window.addEventListener('mousemove', e => { if (dragging) seekFromEvent(e); }); window.addEventListener('mouseup', () => dragging = false); barEl.addEventListener('touchstart', e => { dragging = true; seekFromEvent(e); }, {passive:true}); window.addEventListener('touchmove', e => { if (dragging) seekFromEvent(e); }, {passive:true}); window.addEventListener('touchend', () => dragging = false);
bell.onclick = () => { const a = new Audio('temple-bell.mp3'); a.play().catch(() => {}); bell.animate([{transform:'rotate(-12deg)'},{transform:'rotate(12deg)'},{transform:'rotate(0)'}], {duration:450}); }; listBtn.onclick = () => playlist.classList.toggle('open'); closeList.onclick = () => playlist.classList.remove('open');
// Decorative counter: intentionally not an actual visitor metric.
const liveCount = document.querySelector('#liveCount');
if (liveCount) { let count = 993; setInterval(() => { count += Math.floor(Math.random() * 7) - 3; count = Math.max(980, Math.min(1006, count)); liveCount.textContent = count; }, 12000 + Math.random() * 14000); }
loadTrack(0, false);
