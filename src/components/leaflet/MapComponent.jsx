import React, { useEffect, useState, useMemo, useCallback } from "react";
import L from "leaflet";
import { useMap, Rectangle, LayerGroup, Tooltip } from "react-leaflet";
import { latLonToQtree, QuadToSlippy } from "./helpers";
import {
  rectangleStyle,
  rectangleStyleHover,
  rectangleStyleSelect,
} from "./rectangleStyles";
import createQuadAdapter from "./createQuadAdapter";

export default function MapComponent() {
  const map = useMap();
  const adapter = createQuadAdapter(map);

  const [rectangles, setRectangles] = useState();
  const [layers, setLayers] = useState({});
  const [hashAndRect, setHashAndRect] = useState({});

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
      const bounds = event.target.getBounds();
      const selectedHashes = Object.keys(hashAndRect);

      const isChild = selectedHashes.filter(
        (currentHash) =>
          currentHash != hash &&
          (currentHash.startsWith(hash) || hash.startsWith(currentHash))
      );

      if (isChild.length) {
        const popup = L.popup()
          .setLatLng(bounds.getCenter())
          .setContent(
            "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
          )
          .openOn(map);

        return;
      }

      if (hash in hashAndRect) {
        const { [hash]: removedHash, ...rest } = hashAndRect;
        setHashAndRect(rest);
      } else {
        const rectangle = drawSelectedRect(bounds, hash);
        setHashAndRect({ ...hashAndRect, [hash]: rectangle });
      }
    },
    [hashAndRect]
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

  const drawSelectedRect = (bounds, hash) => {
    return (
      <Rectangle
        key={hash}
        hash={hash}
        bounds={bounds}
        pathOptions={rectangleStyleSelect}
      />
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
      <LayerGroup>
        {hashAndRect &&
          Object.values(hashAndRect).map((i) => {
            return i;
          })}
      </LayerGroup>
    </LayerGroup>
  );
}
