import React, { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMap,
  Rectangle,
  LayerGroup,
} from "react-leaflet";
import { latLonToQtree, QuadToSlippy } from "./helpers";

export default function MapComponent() {
  const map = useMap();
  const [coords, setCoords] = useState({});
  const [rectangles, setRectangles] = useState();

  useEffect(() => {
    if (!map) return;

    map.addEventListener("mousemove", (e) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };

      setCoords(coords);

      setRectangles(updateLayer(coords));
    });

    map.addEventListener("zoomend", (e) => {
      setRectangles(updateLayer(coords));
    });

    map.addEventListener("moveend", (e) => {
      setRectangles(updateLayer(coords));
    });
  }, [map]);

  var quadAdapter = {
    range: ["0", "1", "2", "3"],
    encode: function (centroid, precision) {
      var zoom = precision - 1;

      return latLonToQtree(centroid.lat, centroid.lng, zoom);
    },
    bbox: function (hash) {
      var tileSize = 256;
      var tile = QuadToSlippy(hash);

      var nwTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
      var seTilePoint = new L.Point(tile.x * tileSize, tile.y * tileSize);
      seTilePoint.x += tileSize;
      seTilePoint.y += tileSize;

      var nwLatLon = map.unproject(nwTilePoint, tile.z);
      var seLatLon = map.unproject(seTilePoint, tile.z);

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

  if (typeof Number.prototype.toRad === "undefined") {
    Number.prototype.toRad = function () {
      return (this * Math.PI) / 180;
    };
  }

  var currentHash;
  var adapter = quadAdapter;

  var generateCurrentHash = function (precision, coords) {
    var center = map.getCenter();

    if (coords) {
      center = coords;
    }

    return adapter.encode(center, precision);
  };

  var prevHash = "NOTAHASH";

  var zoomToHashChars = function (zoom) {
    return 1 + Math.floor(zoom / 3);
  };

  function updateLayer(coords) {
    var zoom = map.getZoom();
    var hashLength = zoom + 1;

    // update current hash
    currentHash = generateCurrentHash(hashLength, coords);

    var hashPrefix = currentHash.substr(0, hashLength);

    if (prevHash != hashPrefix) {
      let layers = adapter.layers(currentHash, zoom);

      return Object.keys(layers).map((layerKey) => {
        let tmpVar = drawLayer(layerKey, layers[layerKey]);
        return tmpVar;
      });
    }

    prevHash = hashPrefix;
  }

  function hashSelect(hash, bounds) {
    for (var i = 0; i < selectedHashes.length; i++) {
      if (selectedHashes[i] == hash) continue;
      if (
        selectedHashes[i].startsWith(hash) ||
        hash.startsWith(selectedHashes[i])
      ) {
        console.log("selection contains already added hashes");
        var popup = L.popup()
          .setLatLng(bounds.getCenter())
          .setContent(
            "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
          )
          .openOn(map);
        return;
      }
    }
    if (selectedHashes.includes(hash)) {
      //rect.setStyle(rectStyle);
      const index = selectedHashes.indexOf(hash);
      selectedGroup.removeLayer(selectedRects[index]);
      if (index > -1) {
        selectedHashes.splice(index, 1);
        selectedRects.splice(index, 1);
      }
    } // new select
    // else {
    //   var selrect = L.rectangle(bounds, rectStyleSelect);
    //   selrect.bringToFront();
    //   selrect.on("click", function () {
    //     hashSelect(hash, selrect);
    //   });
    //   selectedHashes.push(hash);
    //   selectedRects.push(selrect);
    //   selrect.addTo(selectedGroup);
    // }
    console.log(hash + " " + selectedHashes);
    document.getElementById("tiles").innerHTML = selectedHashes;
    if (document.getElementById("tiles").innerHTML == "")
      document.getElementById("tiles").innerHTML = "-";
  }

  function drawRect(bounds, hash, showDigit) {
    var hashAndSize = hash + " len:" + hash.length;
    var labels = adapter.labels(hashAndSize); //hash );

    // http://leafletjs.com/reference.html#path-options
    // var poly = L.rectangle(bounds, rectStyle);
    // poly.bringToBack();
    // poly.on("click", function () {
    //   hashSelect(hash, bounds);
    // });
    // poly.on("mouseover", function () {
    //   poly.setStyle(rectStyleHover);
    // });
    // poly.on("mouseout", function () {
    //   poly.setStyle(rectStyle);
    // });
    // poly.on("contextmenu", function (e) {
    //   console.log(latLonToQtree(e.latlng.lat, e.latlng.lng, hash.length));
    // });
    // poly.addTo(layerGroup);

    return (
      <Rectangle key={hash} bounds={bounds} pathOptions={{ color: "red" }} />
    );

    // full (long) hash marker
    // if (labels.long.length > 1) {
    //   //var marker = new L.marker( poly.getBounds().getNorthWest(), { opacity: 0.0001 });
    //   //var marker = new L.marker( poly.getBounds().getNorthWest(), { opacity: 0.0001 });
    //   var marker = L.rectangle(bounds, { opacity: 0, fill: false });
    //   var pointnw = map.latLngToLayerPoint(marker.getBounds().getNorthWest());
    //   var pointc = map.latLngToLayerPoint(marker.getBounds().getCenter());
    //   marker.bindTooltip(labels.long, {
    //     permanent: true,
    //     className: "my-label",
    //     offset: [-(pointc.x - pointnw.x), -(pointc.x - pointnw.x) + 20],
    //     direction: "right",
    //   });
    //   marker.on("click", function () {
    //     hashSelect(hash, bounds);
    //   });
    //   marker.addTo(layerGroup);
    // }
  }

  function drawLayer(prefix, showDigit) {
    return adapter.range.map(function (n) {
      var hash = "" + prefix + n;

      var bbox = adapter.bbox(hash);

      var bounds = L.latLngBounds(
        L.latLng(bbox.maxlat, bbox.minlng),
        L.latLng(bbox.minlat, bbox.maxlng)
      );

      const rectangles = drawRect(bounds, hash, showDigit);

      return rectangles;
    });
  }

  return (
    <LayerGroup>
      {rectangles &&
        rectangles.map((i) => {
          //   return i[0];
          return i.map((j) => {
            return j;
          });
        })}
    </LayerGroup>
  );
}
