import React, { useEffect, useState, useMemo } from "react";
import L from "leaflet";
import { useMap, Rectangle, LayerGroup, Tooltip } from "react-leaflet";
import { latLonToQtree, QuadToSlippy } from "./helpers";
import {
  rectangleStyle,
  rectangleStyleHover,
  rectangleStyleSelect,
} from "./rectangleStyles";

export default function MapComponent() {
  const map = useMap();

  /* Disable zoom on double click 
        - Don't know what is preferred here
        - Double click, wheel scroll, buttons
        - Wheel scroll and buttons seems most reasonable
  */
  map.doubleClickZoom.disable();

  const [coords, setCoords] = useState({});
  const [rectangles, setRectangles] = useState();
  const [selectedRects, setSelectedRects] = useState();
  const [selectedHashes, setSelectedHashes] = useState();

  const rectangleEventHandlers = useMemo(
    () => ({
      mouseover(event) {
        const layer = event.target;
        layer.setStyle(rectangleStyleHover);
      },
      mouseout(event) {
        const layer = event.target;
        layer.setStyle(rectangleStyle);
      },
      click(event) {
        const hash = event.target.options.hash;
        const bounds = event.target.getBounds();
        hashSelect(hash, bounds);
      },
    }),
    []
  );

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
    setSelectedHashes(hash);
    console.log(hash, bounds);

    /* TODO: Check if selection already contains hashes */

    /* TODO: Remove if it exists */

    /* TODO: generate new tile */
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

  function drawRect(bounds, hash, showDigit) {
    var hashAndSize = hash + " len:" + hash.length;
    var labels = adapter.labels(hashAndSize);

    // poly.on("click", function () {
    //   hashSelect(hash, bounds);
    // });
    // poly.on("contextmenu", function (e) {
    //   console.log(latLonToQtree(e.latlng.lat, e.latlng.lng, hash.length));
    // });

    return (
      <Rectangle
        key={hash}
        hash={hash}
        bounds={bounds}
        pathOptions={rectangleStyle}
        eventHandlers={rectangleEventHandlers}
      >
        <Tooltip sticky>{labels.long}</Tooltip>
      </Rectangle>
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
