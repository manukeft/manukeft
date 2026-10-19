// imágenes: Netlify Image CDN convierte a WebP/AVIF y achica al vuelo
// sin w = mismo tamaño, solo cambia el formato (para el lightbox)
function imgUrl(src, w) {
  return `/.netlify/images?url=/${src}` + (w ? `&w=${w}` : '');
}

// nav
function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.section === id);
  });
  window.scrollTo(0, 0);
}

// hero
const slides = document.querySelectorAll('.slide');
const dotsContainer = document.getElementById('dots');
let current = 0;

slides.forEach((_, i) => {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(d);
});

function goTo(n) {
  slides[current].classList.remove('active');
  document.querySelectorAll('.dot')[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  document.querySelectorAll('.dot')[current].classList.add('active');
}

setInterval(() => goTo(current + 1), 4000);

// shop
const fullImgs = [
  'images/shop/df-1.jpg',
  'images/shop/df-2.jpg',
  'images/shop/df-3.jpg',
  'images/shop/df-4.jpg',
  'images/shop/df-5.jpg',
  'images/shop/df-6.jpg',
  'images/shop/df-7.jpg',
  'images/shop/df-8.jpg',
  'images/shop/df-9.jpg',
  'images/shop/df-10.jpg',
  'images/shop/df-11.jpg',
  'images/shop/df-12.jpg',
  'images/shop/df-13.jpg',
  'images/shop/df-14.jpg',
  'images/shop/df-15.jpg',
  'images/shop/df-16.jpg',
];

const thumbImgs = [
  'images/shop/df-1.jpg',
  'images/shop/df-2.jpg',
  'images/shop/df-3.jpg',
  'images/shop/thumbs/df-4.jpg',
  'images/shop/thumbs/df-5.jpg',
  'images/shop/thumbs/df-6.jpg',
  'images/shop/thumbs/df-7.jpg',
  'images/shop/thumbs/df-8.jpg',
  'images/shop/thumbs/df-9.jpg',
  'images/shop/thumbs/df-10.jpg',
  'images/shop/thumbs/df-11.jpg',
  'images/shop/thumbs/df-12.jpg',
  'images/shop/thumbs/df-13.jpg',
  'images/shop/df-14.jpg',
  'images/shop/df-15.jpg',
  'images/shop/df-16.jpg',
];

let activeIndex = 0;
const mainImg = document.getElementById('mainImg');
const thumbs = document.querySelectorAll('.thumb');

function setActive(i) {
  activeIndex = (i + fullImgs.length) % fullImgs.length;
  mainImg.src = imgUrl(thumbImgs[activeIndex], 1200);
  thumbs.forEach(t => t.classList.remove('active'));
  // de la foto 7 en adelante se marca el "+10"
  thumbs[Math.min(activeIndex, 6)].classList.add('active');
}

thumbs.forEach((thumb, i) => {
  if (thumb.classList.contains('thumb-more')) {
    thumb.addEventListener('click', () => setActive(6));
  } else {
    thumb.addEventListener('click', () => setActive(i));
  }
});

document.getElementById('imgPrev').addEventListener('click', () => setActive(activeIndex - 1));
document.getElementById('imgNext').addEventListener('click', () => setActive(activeIndex + 1));

// deslizar sobre la foto del shop para pasar de foto
onSwipe(document.getElementById('mainImgWrap'), d => setActive(activeIndex + d));

// lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxImgs = [];
let lightboxIndex = 0;

const lightboxCounter = document.getElementById('lightboxCounter');

function showLightboxImg() {
  const src = imgUrl(lightboxImgs[lightboxIndex]);
  if (lightboxImg.getAttribute('src') !== src) {
    lightbox.classList.add('loading');
    lightboxImg.src = src;
  }
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImgs.length}`;
  // precarga la anterior y la siguiente: al pasar de foto ya están descargadas
  const n = lightboxImgs.length;
  [lightboxIndex + 1, lightboxIndex - 1].forEach(j => { new Image().src = imgUrl(lightboxImgs[(j + n) % n]); });
}

lightboxImg.addEventListener('load', () => lightbox.classList.remove('loading'));

function showLightbox(imgs, i) {
  lightboxImgs = imgs;
  lightboxIndex = i;
  showLightboxImg();
  lightbox.classList.add('open');
  document.documentElement.classList.add('lightbox-open');
}

function hideLightbox() {
  lightbox.classList.remove('open');
  document.documentElement.classList.remove('lightbox-open');
}

// la URL sin el número de foto: /gallery/new-york/12 → /gallery/new-york
function lightboxBase() {
  return location.pathname.replace(/\/\d+$/, '');
}

function stepLightbox(d) {
  lightboxIndex = (lightboxIndex + d + lightboxImgs.length) % lightboxImgs.length;
  showLightboxImg();
  // replaceState cambia la URL sin sumar un paso al historial: Atrás sigue cerrando el lightbox
  history.replaceState(history.state, '', `${lightboxBase()}/${lightboxIndex + 1}`);
}

function closeLightbox() {
  // si lo abrimos con un clic, Atrás deshace ese paso; si se entró directo por un link, se reemplaza la URL
  if (history.state?.lightbox) history.back();
  else {
    history.replaceState(null, '', lightboxBase());
    render();
  }
}

mainImg.addEventListener('click', () => navigate(`/shop/${activeIndex + 1}`, { lightbox: true }));

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
document.getElementById('lightboxPrev').addEventListener('click', () => stepLightbox(-1));
document.getElementById('lightboxNext').addEventListener('click', () => stepLightbox(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
  if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
});

// series
const series = {
  'new-york': {
    title: 'New York',
    total: 136,
    prefix: 'images/gallery/new-york/ny-',
    ext: '.jpg'
  },
  'graffiti': {
    title: 'Graffiti',
    total: 65,
    prefix: 'images/gallery/graffiti/graff-',
    ext: '.jpg'
  },
  'lifestyle': {
    title: 'Lifestyle',
    total: 76,
    prefix: 'images/gallery/lifestyle/life-',
    ext: '.jpg'
  },
  'world-champion': {
    title: 'World Champion',
    total: 34,
    prefix: 'images/gallery/world-champion/wc-',
    ext: '.jpg'
  },
  'baires': {
    title: 'Baires',
    total: 17,
    prefix: 'images/gallery/baires/baires-',
    ext: '.jpg'
  },
  //'perros': {
  //  title: 'Perritos Dormilones',
  //  total: 0,
  //  prefix: 'images/gallery/perros/perros-',
  //  ext: '.jpg'
  //},
};

function buildImgs(serie) {
  return Array.from({ length: serie.total }, (_, i) => `${serie.prefix}${i + 1}${serie.ext}`);
}

let currentSerieImgs = [];

function openSerie(id) {
  const serie = series[id];
  currentSerieImgs = buildImgs(serie);
  document.getElementById('serie-title').textContent = serie.title;
  const grid = document.getElementById('serie-grid');
  const cols = window.innerWidth <= 768 ? 3 : 5;
  const columns = Array.from({ length: cols }, () => []);
  currentSerieImgs.forEach((src, i) => columns[i % cols].push({ src, i }));
  grid.innerHTML = columns.map(col =>
    `<div class="serie-col">${col.map(({ src, i }) =>
      `<img src="${imgUrl(src, 600)}" loading="lazy" decoding="async" alt="" data-i="${i}">`
    ).join('')}</div>`
  ).join('');
  document.getElementById('gallery-series').style.display = 'none';
  document.getElementById('gallery-inner').classList.remove('gallery-inner-hidden');
  window.scrollTo(0, 0);
}

function closeSerie() {
  document.getElementById('gallery-series').style.display = 'block';
  document.getElementById('gallery-inner').classList.add('gallery-inner-hidden');
  window.scrollTo(0, 0);
}

document.getElementById('serie-grid').addEventListener('click', e => {
  if (e.target.dataset.i) navigate(`${lightboxBase()}/${+e.target.dataset.i + 1}`, { lightbox: true });
});

// menu
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// deslizar: fn(1) hacia la izquierda (siguiente), fn(-1) hacia la derecha (anterior)
function onSwipe(el, fn) {
  let x0 = null;
  el.addEventListener('touchstart', e => {
    // con dos dedos es zoom, no deslizar
    x0 = e.touches.length === 1 ? e.touches[0].clientX : null;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const diff = x0 - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) fn(diff > 0 ? 1 : -1);
    x0 = null;
  });
}

onSwipe(lightbox, stepLightbox);

// rutas: cada sección tiene su URL (/shop, /gallery/new-york, /gallery/new-york/12)
// y el historial del navegador (Atrás/Adelante, gestos del celular) la recorre
const sections = ['home', 'shop', 'gallery', 'videos', 'about'];
let currentSection = null;
let currentSerie = null;

// dibuja la página según la URL actual
function render() {
  const parts = location.pathname.split('/').filter(Boolean);
  let section = parts[0] || 'home';
  if (!sections.includes(section)) {
    history.replaceState(null, '', '/');
    section = 'home';
  }
  const serie = section === 'gallery' && series[parts[1]] ? parts[1] : null;
  if (section === 'gallery' && parts[1] && !serie) history.replaceState(null, '', '/gallery');
  // número de foto: /shop/3 o /gallery/new-york/12
  const photo = Number(section === 'shop' ? parts[1] : serie ? parts[2] : 0);

  if (section !== currentSection) {
    showSection(section);
    currentSection = section;
  }
  if (serie !== currentSerie) {
    serie ? openSerie(serie) : closeSerie();
    currentSerie = serie;
  }

  const imgs = section === 'shop' ? fullImgs : serie ? currentSerieImgs : null;
  if (imgs && photo >= 1 && photo <= imgs.length) showLightbox(imgs, photo - 1);
  else hideLightbox();

  const name = serie ? series[serie].title : document.querySelector(`.nav-links a[data-section=${section}]`).textContent;
  document.title = section === 'home' ? 'manukeft' : `${name.toLowerCase()} — manukeft`;
  // canonical: la URL de la sección sin el número de foto
  document.querySelector('link[rel=canonical]').href = 'https://manukeft.com' + (photo ? lightboxBase() : location.pathname);
}

// pushState suma un paso al historial con la nueva URL, sin recargar la página
function navigate(path, state = null) {
  history.pushState(state, '', path);
  render();
}

document.addEventListener('click', e => {
  const a = e.target.closest('a[data-link]');
  // ctrl/cmd + clic o clic del medio: que el navegador abra otra pestaña como siempre
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  if (a.getAttribute('href') !== location.pathname) navigate(a.getAttribute('href'));
});

window.addEventListener('popstate', render);
render();