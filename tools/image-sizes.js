// mide las fotos de cada serie y guarda su proporción (ancho/alto) en images/gallery/sizes.json
// la galería la usa para repartir las fotos en columnas parejas antes de que carguen
// correr después de agregar fotos:  node tools/image-sizes.js
const fs = require('fs');
const path = require('path');

const gallery = path.join(__dirname, '..', 'images', 'gallery');

// lee ancho y alto del encabezado de un JPG
function jpegSize(file) {
  const d = fs.readFileSync(file);
  let i = 2;
  while (i < d.length) {
    const marker = d[i + 1];
    const len = d.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { w: d.readUInt16BE(i + 7), h: d.readUInt16BE(i + 5) };
    i += 2 + len;
  }
  throw new Error('no pude leer el tamaño de ' + file);
}

const sizes = {};
for (const serie of fs.readdirSync(gallery)) {
  const dir = path.join(gallery, serie);
  if (!fs.statSync(dir).isDirectory()) continue;
  // solo las numeradas (ny-1.jpg, ny-2.jpg...), en orden
  const fotos = fs.readdirSync(dir)
    .map(f => ({ f, n: Number((f.match(/-(\d+)\.jpg$/) || [])[1]) }))
    .filter(x => x.n)
    .sort((a, b) => a.n - b.n);
  sizes[serie] = fotos.map(({ f }) => {
    const { w, h } = jpegSize(path.join(dir, f));
    return Math.round((w / h) * 1000) / 1000;
  });
  console.log(`${serie}: ${fotos.length} fotos`);
}

fs.writeFileSync(path.join(gallery, 'sizes.json'), JSON.stringify(sizes));
console.log('listo: images/gallery/sizes.json');
