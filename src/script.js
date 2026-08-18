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
  mainImg.src = thumbImgs[activeIndex];
  thumbs.forEach(t => t.classList.remove('active'));
  if (activeIndex < 6) thumbs[activeIndex].classList.add('active');
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

// lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
let lightboxImgs = [];
let lightboxIndex = 0;

function openLightbox(imgs, i) {
  lightboxImgs = imgs;
  lightboxIndex = i;
  lightboxImg.src = lightboxImgs[lightboxIndex];
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
}

mainImg.addEventListener('click', () => openLightbox(fullImgs, activeIndex));

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);

document.getElementById('lightboxPrev').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex - 1 + lightboxImgs.length) % lightboxImgs.length;
  lightboxImg.src = lightboxImgs[lightboxIndex];
});

document.getElementById('lightboxNext').addEventListener('click', () => {
  lightboxIndex = (lightboxIndex + 1) % lightboxImgs.length;
  lightboxImg.src = lightboxImgs[lightboxIndex];
});

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
    total: 67,
    prefix: 'images/gallery/graffiti/graff-',
    ext: '.jpg'
  },
  'lifestyle': {
    title: 'Lifestyle',
    total: 70,
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
  return Array.from({ length: serie.total }, (_, i) => {
    const n = String(i + 1).padStart(1, '0');
    return `${serie.prefix}${n}${serie.ext}`;
  });
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
      `<img src="${src}" alt="" onclick="openLightbox(currentSerieImgs, ${i})">`
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

// deslizar lightbox
let touchStartX = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) document.getElementById('lightboxNext').click();
    else document.getElementById('lightboxPrev').click();
  }
});