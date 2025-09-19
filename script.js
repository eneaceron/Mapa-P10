// ====== PRÁCTICA LEAFLET ======
// 1) Configuración básica del mapa
const centerCDMX = [19.4326, -99.1332]; // Zócalo CDMX
const map = L.map('map', {
  center: centerCDMX,
  zoom: 12,
  zoomControl: true
});

// 2) Capas base (elige la que prefieras en el control)
const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const osmHOT = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  maxZoom: 20,
  attribution: '&copy; OpenStreetMap contributors, HOT'
});

const baseLayers = {
  'OSM Standard': osmStandard,
  'OSM Humanitarian': osmHOT
};

// 3) Marcadores (edita la lista `lugares` para personalizar)
const lugares = [
  { nombre: 'Zócalo de la CDMX', coords: [19.4326, -99.1332], desc: 'Plaza principal de la ciudad.' },
  { nombre: 'Bosque de Chapultepec', coords: [19.4204, -99.1819], desc: 'Parque urbano icónico.' },
  { nombre: 'Coyoacán (Centro)', coords: [19.3553, -99.1638], desc: 'Barrio histórico al sur.' },
  { nombre: 'Basílica de Guadalupe', coords: [19.4840, -99.1171], desc: 'Centro religioso y cultural.' },
  { nombre: 'UNAM (Rectoría)', coords: [19.3323, -99.1900], desc: 'Ciudad Universitaria.' }
];

const marcadores = L.layerGroup();
lugares.forEach((l) => {
  L.marker(l.coords)
    .bindPopup(`<strong>${l.nombre}</strong><br>${l.desc}`)
    .addTo(marcadores);
});
marcadores.addTo(map);

// 4) Cargar un GeoJSON de contexto (./data.geojson)
let capaGeoJSON; // referencia para el control
fetch('./data.geojson')
  .then((r) => r.json())
  .then((geojsonData) => {
    capaGeoJSON = L.geoJSON(geojsonData, {
      style: (feature) => ({
        color: '#2563eb', // azul
        weight: 2,
        fillOpacity: 0.1
      }),
      onEachFeature: (feature, layer) => {
        const nombre = feature?.properties?.name ?? 'Área';
        layer.bindPopup(`<strong>${nombre}</strong>`);
      }
    }).addTo(map);

    // 5) Ajustar la vista a la extensión de marcadores + geojson
    try {
      const group = L.featureGroup([marcadores, capaGeoJSON]);
      map.fitBounds(group.getBounds().pad(0.1));
    } catch (e) {
      // si falla (p. ej. sin geojson), al menos usamos marcadores
      const group = L.featureGroup([marcadores]);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  })
  .catch(() => {
    // si no existe o hay error, solo encuadramos a marcadores
    const group = L.featureGroup([marcadores]);
    map.fitBounds(group.getBounds().pad(0.1));
  });

// 6) Controles útiles
L.control.scale({ imperial: false }).addTo(map);
L.control.layers(baseLayers, { 'Marcadores': marcadores }, { collapsed: true }).addTo(map);

// —— CONSEJOS ——
// - Para cambiar el área por defecto, edita `centerCDMX` y `lugares`.
// - Para usar tu propio GeoJSON, reemplaza el contenido de `data.geojson`.
// - Sube estos cuatro archivos a GitHub Pages para publicar tu mapa fácilmente.
