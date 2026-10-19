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
  d.setAttribute('role', 'button');
  d.tabIndex = 0;
  d.setAttribute('aria-label', `Foto ${i + 1}`);
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

// avanza solo cada 4s, salvo: mouse encima, fuera de la home, pestaña oculta,
// o si la persona activó "reducir movimiento" en su dispositivo
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let heroHover = false;
const slidesEl = document.getElementById('slides');
slidesEl.addEventListener('mouseenter', () => { heroHover = true; });
slidesEl.addEventListener('mouseleave', () => { heroHover = false; });

setInterval(() => {
  const onHome = document.getElementById('home').classList.contains('active');
  if (onHome && !heroHover && !document.hidden && !reduceMotion.matches) goTo(current + 1);
}, 4000);

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
  mainImg.alt = `Doble Filo — foto ${activeIndex + 1}`;
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
  lightboxImg.alt = `Foto ${lightboxIndex + 1} de ${lightboxImgs.length}`;
  // precarga la anterior y la siguiente: al pasar de foto ya están descargadas
  const n = lightboxImgs.length;
  [lightboxIndex + 1, lightboxIndex - 1].forEach(j => { new Image().src = imgUrl(lightboxImgs[(j + n) % n]); });
}

lightboxImg.addEventListener('load', () => lightbox.classList.remove('loading'));

// con teclado: al abrir, el foco pasa al lightbox; al cerrar, vuelve a la foto que lo abrió
let lightboxOpener = null;

function showLightbox(imgs, i) {
  lightboxImgs = imgs;
  lightboxIndex = i;
  showLightboxImg();
  if (!lightbox.classList.contains('open')) {
    lightboxOpener = document.activeElement;
    lightbox.classList.add('open');
    document.documentElement.classList.add('lightbox-open');
    document.getElementById('lightboxClose').focus({ preventScroll: true });
  }
}

function hideLightbox() {
  if (!lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  document.documentElement.classList.remove('lightbox-open');
  lightboxOpener?.focus({ preventScroll: true });
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
  // Tab da vueltas entre los botones del lightbox, no se escapa a la página de atrás
  if (e.key === 'Tab') {
    const btns = [...lightbox.querySelectorAll('button')];
    const i = btns.indexOf(document.activeElement);
    e.preventDefault();
    btns[(i + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
  }
});

// elementos con role="button" que no son <button>: que respondan a Enter y Espacio
document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[role=button]')) {
    e.preventDefault();
    e.target.click();
  }
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

// proporción (ancho/alto) de cada foto, generada con: node tools/image-sizes.js
let sizesPromise = null;
function getSizes() {
  sizesPromise ??= fetch('/images/gallery/sizes.json').then(r => r.json()).catch(() => ({}));
  return sizesPromise;
}

const mobileQuery = matchMedia('(max-width: 768px)');

// reparte las fotos en columnas parejas: cada foto va a la columna más corta
async function buildSerieGrid(id) {
  const serie = series[id];
  const ratios = (await getSizes())[id] || [];
  if (currentSerie !== id) return; // se cambió de serie mientras cargaba
  const cols = Array.from({ length: mobileQuery.matches ? 3 : 5 }, () => {
    const col = document.createElement('div');
    col.className = 'serie-col';
    return col;
  });
  const heights = cols.map(() => 0);
  currentSerieImgs.forEach((src, i) => {
    const ratio = ratios[i] || 0.75; // si falta en sizes.json, se estima vertical
    const img = document.createElement('img');
    img.src = imgUrl(src, 600);
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = `${serie.title} — foto ${i + 1}`;
    img.setAttribute('role', 'button');
    img.tabIndex = 0;
    img.dataset.i = i;
    img.style.aspectRatio = ratio; // reserva el lugar exacto antes de que cargue
    const shortest = heights.indexOf(Math.min(...heights));
    cols[shortest].appendChild(img);
    heights[shortest] += 1 / ratio; // alto relativo: todas las columnas tienen el mismo ancho
  });
  document.getElementById('serie-grid').replaceChildren(...cols);
}

function openSerie(id) {
  currentSerieImgs = buildImgs(series[id]);
  document.getElementById('serie-title').textContent = series[id].title;
  document.getElementById('serie-grid').replaceChildren();
  buildSerieGrid(id);
  document.getElementById('gallery-series').style.display = 'none';
  document.getElementById('gallery-inner').classList.remove('gallery-inner-hidden');
  window.scrollTo(0, 0);
}

// al rotar el celular o achicar la ventana, se rearman las columnas
mobileQuery.addEventListener('change', () => { if (currentSerie) buildSerieGrid(currentSerie); });

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

// aria-expanded / aria-label: los lectores de pantalla anuncian si el menú está abierto
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

hamburger.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));

document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => setMenu(false));
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
  if (!sections.includes(section)) section = 'notfound';
  const serie = section === 'gallery' && series[parts[1]] ? parts[1] : null;
  if (section === 'gallery' && parts[1] && !serie) history.replaceState(null, '', '/gallery');
  // número de foto: /shop/3 o /gallery/new-york/12
  const photo = Number(section === 'shop' ? parts[1] : serie ? parts[2] : 0);

  if (section !== currentSection) {
    showSection(section);
    currentSection = section;
  }
  if (serie !== currentSerie) {
    currentSerie = serie;
    serie ? openSerie(serie) : closeSerie();
  }

  const imgs = section === 'shop' ? fullImgs : serie ? currentSerieImgs : null;
  if (imgs && photo >= 1 && photo <= imgs.length) showLightbox(imgs, photo - 1);
  else hideLightbox();

  const name = serie ? series[serie].title
    : section === 'notfound' ? 'página no encontrada'
    : document.querySelector(`.nav-links a[data-section=${section}]`).textContent;
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