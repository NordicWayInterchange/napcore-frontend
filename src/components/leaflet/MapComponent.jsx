import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  //map.doubleClickZoom.disable();

  const [coords, setCoords] = useState({});
  const [rectangles, setRectangles] = useState();
  const [selectedRects, setSelectedRects] = useState();
  const [selectedHashes, setSelectedHashes] = useState([]);
  const [layers, setLayers] = useState({});

  const updateLayer = useCallback(
    (coords) => {
      var zoom = map.getZoom();
      var center = map.getCenter();
      var hashLength = zoom + 1;

      if (coords) {
        center = coords;
      }

      const currentHash = adapter.encode(center, hashLength);

      let layers = adapter.layers(currentHash, zoom);
      setLayers(layers);
    },
    [adapter, map, setLayers]
  );

  const onMove = useCallback(
    (e) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setCoords(coords);
      setRectangles(updateLayer(coords));
    },
    [updateLayer]
  );

  const onZoom = useCallback(() => {
    setRectangles(updateLayer(map.getCenter()));
  }, [map, updateLayer]);

  useEffect(() => {
    if (!map) return;

    map.on("mousemove", onMove);
    return () => {
      map.off("mousemove", onMove);
    };
  }, [map, onMove]);

  useEffect(() => {
    if (!map) return;

    map.on("zoomend", onZoom);
    return () => {
      map.off("zoomend", onZoom);
    };
  }, [map, onZoom]);

  useEffect(() => {
    const rectangles = Object.keys(layers).map((layerKey) => {
      let tmpVar = drawLayer(layerKey, layers[layerKey]);
      return tmpVar;
    });
    setRectangles(rectangles);
  }, [layers]);

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

  var adapter = quadAdapter;

  function hashSelect(hash, bounds) {
    if (selectedHashes.includes(hash)) {
      console.log(selectedHashes.includes(hash));
      const index = selectedHashes.indexOf(hash);
      if (index > -1) {
        selectedHashes.splice(index, 1);
      }
    } else {
      console.log(selectedHashes.includes(hash));
      setSelectedHashes((existingHash) => [...existingHash, hash]);
    }
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

    console.log(selectedHashes);

    return (
      <Rectangle
        key={hash}
        hash={hash}
        bounds={bounds}
        pathOptions={rectangleStyle}
        eventHandlers={{
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
        }}
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
