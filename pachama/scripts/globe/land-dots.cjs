// Makes public/screens/globe-dots.bin for the Insights globe: points spread
// evenly over a sphere (a Fibonacci lattice), kept where they fall on land
// in Natural Earth's 50m land (world-atlas, public domain), south of 72°N
// and north of 60°S. Stored as Int16 pairs: lon × 100, lat × 100.
// usage: node scripts/globe/land-dots.cjs <dir with world-atlas and topojson-client packages>
const fs = require("fs");
const path = require("path");
const pkgs = process.argv[2];
const topojson = require(path.join(pkgs, "topojson-client-3.1.0/package/dist/topojson-client.js"));
const world = JSON.parse(fs.readFileSync(path.join(pkgs, "world-atlas-2.0.2/package/land-50m.json"), "utf8"));
const land = topojson.feature(world, world.objects.land);
const features = land.type === "FeatureCollection" ? land.features : [land];
const polys = features.flatMap((f) => (f.geometry.type === "MultiPolygon" ? f.geometry.coordinates : [f.geometry.coordinates]));

// Unwrap each ring so no step crosses more than 180° of longitude.
const unwrap = (ring) => {
  let shift = 0;
  return ring.map(([lon, lat], k) => {
    if (k) {
      const d = lon + shift - (ring[k - 1][0] + prevShift);
      if (d > 180) shift -= 360;
      else if (d < -180) shift += 360;
    }
    prevShift = shift;
    return [lon + shift, lat];
  });
};
let prevShift = 0;
const rings = polys.map((poly) => poly.map((r) => { prevShift = 0; return unwrap(r); }));
const bbox = rings.map((poly) => {
  let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
  for (const [lon, lat] of poly[0]) { a = Math.min(a, lon); b = Math.max(b, lon); c = Math.min(c, lat); d = Math.max(d, lat); }
  return [a, b, c, d];
});
const inRing = (lon, lat, ring) => {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i], [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
};
const onLand = (lon, lat) => {
  for (let p = 0; p < rings.length; p++) {
    const [a, b, c, d] = bbox[p];
    if (lat < c || lat > d) continue;
    for (const L of [lon, lon + 360, lon - 360]) {
      if (L < a || L > b) continue;
      const [outer, ...holes] = rings[p];
      if (inRing(L, lat, outer) && !holes.some((h) => inRing(L, lat, h))) return true;
    }
  }
  return false;
};
const N = 30000;
const golden = Math.PI * (3 - Math.sqrt(5));
const out = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  if (lat > 72 || lat < -60) continue;
  let lon = (((i * golden) * 180) / Math.PI) % 360;
  if (lon > 180) lon -= 360;
  if (onLand(lon, lat)) out.push(Math.round(lon * 100), Math.round(lat * 100));
}
const buf = Buffer.from(new Int16Array(out).buffer);
fs.writeFileSync(path.join(__dirname, "../../public/screens/globe-dots.bin"), buf);
console.log(`${out.length / 2} land dots, ${buf.length} bytes`);
