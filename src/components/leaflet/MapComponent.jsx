import React, { useEffect, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import { useMap, Rectangle, LayerGroup, Tooltip } from "react-leaflet";
import { latLonToQtree, QuadToSlippy } from "./helpers";
import {
  rectangleStyle,
  rectangleStyleHover,
  rectangleStyleSelect,
} from "./rectangleStyles";

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

export default function MapComponent() {
  const map = useMap();
  const adapter = createQuadAdapter(map);

  const [coords, setCoords] = useState({});
  const [rectangles, setRectangles] = useState();
  const [selectedRects, setSelectedRects] = useState();
  const [selectedHashes, setSelectedHashes] = useState([]);
  const [layers, setLayers] = useState({});

  // drawing functions
  const drawLayer = (adapter, prefix, showDigit) => {
    return adapter.range.map(function (n) {
      const hash = "" + prefix + n;
      const bbox = adapter.bbox(hash);
      const bounds = L.latLngBounds(
        L.latLng(bbox.maxlat, bbox.minlng),
        L.latLng(bbox.minlat, bbox.maxlng)
      );

      return drawRect(adapter, bounds, hash, showDigit);
    });
  };

  const rectangleClickHandler = useCallback(
    (event) => {
      const hash = event.target.options.hash;

      let currentHashes = selectedHashes;
      const index = selectedHashes.indexOf(hash);
      if (index != -1) {
        currentHashes = selectedHashes.filter((item) => item != hash);
      } else {
        currentHashes = [...selectedHashes, hash];
      }
      setSelectedHashes(currentHashes);
    },
    [setSelectedHashes, selectedHashes]
  );

  const drawRect = (adapter, bounds, hash, showDigit) => {
    const hashAndSize = hash + " len:" + hash.length;
    const labels = adapter.labels(hashAndSize);
    return (
      <Rectangle
        key={hash}
        hash={hash}
        bounds={bounds}
        pathOptions={rectangleStyle}
        eventHandlers={{
          mouseover: (event) => {
            event.target.setStyle(rectangleStyleHover);
          },
          mouseout: (event) => {
            event.target.setStyle(rectangleStyle);
          },
          click: rectangleClickHandler,
        }}
      >
        <Tooltip sticky>{labels.long}</Tooltip>
      </Rectangle>
    );
  };

  // event handling on the map
  const updateLayer = useCallback(
    (coords) => {
      const zoom = map.getZoom();
      let center = map.getCenter();
      const hashLength = zoom + 1;

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
    return () => map.off("mousemove", onMove);
  }, [map, onMove]);

  useEffect(() => {
    if (!map) return;

    map.on("zoomend", onZoom);
    return () => map.off("zoomend", onZoom);
  }, [map, onZoom]);

  useEffect(() => {
    const rectangles = Object.keys(layers).map((layerKey) =>
      drawLayer(adapter, layerKey, layers[layerKey])
    );
    setRectangles(rectangles);
  }, [layers]);
  return (
    <LayerGroup>
      {rectangles &&
        rectangles.map((i) => {
          return i.map((j) => {
            return j;
          });
        })}
    </LayerGroup>
  );
}
