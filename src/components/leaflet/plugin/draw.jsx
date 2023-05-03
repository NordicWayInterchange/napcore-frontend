import L from "leaflet";
import { Rectangle } from "react-leaflet";
//import { quadAdapter } from "./adapter";
import { zoomToHashChars, latLonToQtree, QuadToSlippy } from "./helpers";

let currentHash;
var prevHash = "NOTAHASH";

function updateLayer(mapCenter, mapZoom, coords) {
  //var zoom = map.getZoom();
  var zoom = mapZoom;
  var hashLength = zoom + 1;

  console.log("mapCenter: ", mapCenter);
  console.log("mapZoom: ", mapZoom);

  currentHash = generateCurrentHash(hashLength, mapCenter, coords);

  // if (quadAdapter === hashAdapter) {
  //   hashLength = zoomToHashChars(zoom);
  // }

  var hashPrefix = currentHash.substr(0, hashLength);

  if (prevHash != hashPrefix) {
    //layerGroup.clearLayers();

    var layers = quadAdapter.layers(currentHash, zoom);
    for (var attr in layers) {
      drawLayerAndRect(attr, layers[attr]);
    }
  }

  prevHash = hashPrefix;
}

const quadAdapter = {
  range: ["0", "1", "2", "3"],
  encode: function (centroid, precision) {
    var zoom = precision - 1;
    //var tile = getTileXYZ( centroid.lat, centroid.lng, zoom );
    //return SlippyToQuad( tile.x, tile.y, tile.z );
    return latLonToQtree(centroid.lat, centroid.lng, zoom);
  },
  bbox: function (hash) {
    var tileSize = 256;
    var tile = QuadToSlippy(hash);
    console.log("QuadToSlippy: ", tile);

    // get NorthWest and SouthEast points
    /* LEAFLET */
    var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
    seTilePoint.x += tileSize;
    seTilePoint.y += tileSize;
    console.log("seTilePoint: ", seTilePoint);

    // TODO: Get correct values and not hardcoded
    // var nwLatLon = map.unproject(nwTilePoint, tile.z);
    var nwLatLon = L.latLng(50.5, 30.5);
    var seLatLon = L.latLng(50.5, 30.5);
    console.log(seLatLon);
    // var seLatLon = map.unproject(seTilePoint, tile.z);

    return {
      minlng: nwLatLon.lng,
      minlat: seLatLon.lat,
      maxlng: seLatLon.lng,
      maxlat: nwLatLon.lat,
    };
  },
  layers: function (currentHash, zoom) {
    var layers = {};
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
};

var mousePositionEvent = null;

var generateCurrentHash = function (precision, mapCenter, coords) {
  var center = mapCenter;

  if (mousePositionEvent) {
    center = coords;
  }

  return quadAdapter.encode(center, precision);
};

function drawLayerAndRect(prefix, showDigit, hash) {
  // quadAdapter.range.forEach(function (n) {
  //   var hash = "" + prefix + n;

  //   var bbox = quadAdapter.bbox(hash);

  //   var bounds = L.latLngBounds(
  //     L.latLng(bbox.maxlat, bbox.minlng),
  //     L.latLng(bbox.minlat, bbox.maxlng)
  //   );

  //   const blackOptions = { color: "black" };

  //   return <Rectangle bounds={bounds} pathOptions={blackOptions} />;
  // });

  quadAdapter.range.forEach(function (n) {
    var hash = "" + prefix + n;

    console.log("hash: ", hash, n);

    var bbox = quadAdapter.bbox(hash);

    var bounds = L.latLngBounds(
      L.latLng(bbox.maxlat, bbox.minlng),
      L.latLng(bbox.minlat, bbox.maxlng)
    );

    const blackOptions = { color: "red" };

    //return <Rectangle bounds={bounds} pathOptions={blackOptions} />;
  });
}

export default updateLayer;
