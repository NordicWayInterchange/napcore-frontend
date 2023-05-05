import { latLonToQtree, QuadToSlippy } from "./helpers";

const createQuadAdapter = (map) => ({
  range: ["0", "1", "2", "3"],
  encode: function (centroid, precision) {
    const zoom = precision - 1;
    return latLonToQtree(centroid.lat, centroid.lng, zoom);
  },
  bbox: function (hash) {
    const tileSize = 256;
    const tile = QuadToSlippy(hash);

    const nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    const seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    seTilePoint.x += tileSize;
    seTilePoint.y += tileSize;

    const nwLatLon = map.unproject(nwTilePoint, tile.z);
    const seLatLon = map.unproject(seTilePoint, tile.z);

    return {
      minlng: nwLatLon.lng,
      minlat: seLatLon.lat,
      maxlng: seLatLon.lng,
      maxlat: nwLatLon.lat,
    };
  },
  layers: function (currentHash, zoom) {
    const layers = {};

    if (zoom > 2) layers[currentHash.substr(0, zoom - 2)] = true;
    if (zoom > 1) layers[currentHash.substr(0, zoom - 1)] = true;
    layers[currentHash.substr(0, zoom)] = true;
    return layers;
  },
  labels: function (hash) {
    return {
      long: hash,
      short: hash.substr(-1, 1),
    };
  },
});

export default createQuadAdapter;
