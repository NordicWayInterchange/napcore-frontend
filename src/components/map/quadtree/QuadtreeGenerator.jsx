import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { useMap, Rectangle, LayerGroup, useMapEvents } from "react-leaflet";
import {
  rectangleStyle,
  rectangleStyleHover,
  rectangleStyleSelect,
} from "./RectangleStyles";
import quadAdapter from "../adapters/QuadAdapter";
import { isHashChild } from "./helpers";

export default function QuadtreeGenerator({
  quadtree,
  quadtreeCallback,
  controlsCallback,
  interactive,
}) {
  const map = useMap();
  const adapter = quadAdapter(map);

  const [rectangles, setRectangles] = useState();
  const [layers, setLayers] = useState({});
  const [hashAndRect, setHashAndRect] = useState({});

  // TODO: Add conditional for !interactive
  useMapEvents({
    mousemove(event) {
      const coords = { lat: event.latlng.lat, lng: event.latlng.lng };
      updateLayer(coords);
    },
  });

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

  useEffect(() => {
    if (quadtree.length && !Object.keys(hashAndRect).length) {
      enterHash(quadtree);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quadtree]);

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

  // const rectangleClickHandler = useCallback(
  //   (event) => {
  //     const hash = event.target.options.hash;
  //     const bounds = event.target.getBounds();
  //     const selectedHashes = Object.keys(hashAndRect);

  //     const isChild = selectedHashes.filter(
  //       (currentHash) =>
  //         currentHash !== hash &&
  //         (currentHash.startsWith(hash) || hash.startsWith(currentHash))
  //     );

  //     if (isChild.length) {
  //       const popup = L.popup()
  //         .setLatLng(bounds.getCenter())
  //         .setContent(
  //           "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
  //         )
  //         .openOn(map);

  //       return;
  //     }

  //     let returned;
  //     if (hash in hashAndRect) {
  //       const { [hash]: removedHash, ...rest } = hashAndRect;
  //       returned = rest;
  //     } else {
  //       const rectangle = drawSelectedRect(bounds, hash);
  //       returned = { ...hashAndRect, [hash]: rectangle };
  //     }
  //     setHashAndRect(returned);
  //     quadtreeCallback(Object.keys(returned));
  //     controlsCallback(Object.keys(returned));
  //   },
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [hashAndRect, quadtreeCallback]
  // );

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
          // click: rectangleClickHandler,
        }}
      >
        {/* <Tooltip sticky>{labels.long}</Tooltip> */}
        {/* <Tooltip direction="right" offset={[0, 20]} opacity={1} permanent>
          {hashAndSize}
        </Tooltip> */}
      </Rectangle>
    );
  };

  function enterHash(hashes) {
    const rectangles = {};

    for (let i = 0; i < hashes.length; i++) {
      let hash = hashes[i];
      let bbox = adapter.bbox(hash);

      let bounds = L.latLngBounds(
        L.latLng(bbox.maxlat, bbox.minlng),
        L.latLng(bbox.minlat, bbox.maxlng)
      );

      rectangles[hash] = drawSelectedRect(bounds, hash);
    }
    setHashAndRect(rectangles);
  }

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

  useEffect(() => {
    const rectangles = Object.keys(layers).map((layerKey) =>
      drawLayer(adapter, layerKey, layers[layerKey])
    );
    setRectangles(rectangles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
