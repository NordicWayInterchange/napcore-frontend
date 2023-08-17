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

  const [layers, setLayers] = useState([]);
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [prevHash, setPrevHash] = useState();
  const [mousePosition, setMousePosition] = useState();

  useEffect(() => {
    if (!interactive) return;

    updateLayer(true);
  }, [selectedLayers]);

  useEffect(() => {
    if (quadtree.length && !selectedLayers.length) {
      generateSelectedLayersFromQuadtree();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quadtree]);

  useMapEvents({
    mousemove(event) {
      if (interactive) {
        setMousePosition(event);
        updateLayer();
      }
    },
  });

  const drawSelectedRect = (bounds, hash) => {
    return (
      <Rectangle
        key={hash}
        hash={hash}
        bounds={bounds}
        pathOptions={rectangleStyleSelect}
        interactive={false}
      />
    );
  };

  const generateCurrentHash = (precision) => {
    var center = map.getCenter();

    if (mousePosition) {
      center = mousePosition.latlng;
    }

    return adapter.encode(center, precision);
  };

  const generateSelectedLayersFromQuadtree = () => {
    const rectangles = [];

    quadtree.forEach((hash) => {
      const bbox = adapter.bbox(hash);
      const bounds = L.latLngBounds(
        L.latLng(bbox.maxlat, bbox.minlng),
        L.latLng(bbox.minlat, bbox.maxlng)
      );

      rectangles.push(
        <Rectangle
          key={hash}
          hash={hash}
          bounds={bounds}
          pathOptions={rectangleStyleSelect}
        />
      );
    });

    setSelectedLayers(rectangles);
  };

  const layerClickHandler = (event) => {
    const hash = event.target.options.hash;
    const bounds = event.target.getBounds();
    const allHashes = selectedLayers.map((layer) => layer.key);

    const isChild = allHashes.filter(
      (currentHash) =>
        currentHash !== hash &&
        (currentHash.startsWith(hash) || hash.startsWith(currentHash))
    );

    if (isChild.length) {
      L.popup()
        .setLatLng(bounds.getCenter())
        .setContent(
          "<p>Selection contains already added tiles.</br>Zoom in/out and click the already selected tiles to remove them.</p>"
        )
        .openOn(map);

      return;
    }

    const rectangle = drawSelectedRect(bounds, hash);

    const exists = selectedLayers.filter((obj) => {
      return obj.key === hash;
    });

    if (exists.length) {
      setSelectedLayers(selectedLayers.filter((obj) => obj.key !== hash));
    } else {
      setSelectedLayers([...selectedLayers, rectangle]);
    }
  };

  const updateLayer = (force = false) => {
    const zoom = map.getZoom();
    const hashLength = zoom + 1;
    const currentHash = generateCurrentHash(hashLength);
    const hashPrefix = currentHash.substr(0, hashLength); // TODO: Deprecated

    if (prevHash != hashPrefix || force == true) {
      let layers = adapter.layers(currentHash, zoom);

      console.log(Math.random(), layers);
      const rectangles = Object.keys(layers).map((layerKey) =>
        drawLayer(adapter, layerKey, layers[layerKey])
      );

      setLayers(rectangles);
    }

    setPrevHash(hashPrefix);
  };

  const drawLayer = (adapter, prefix, showDigit) => {
    return adapter.range.map(function (n) {
      const hash = "" + prefix + n;
      const bbox = adapter.bbox(hash);
      const bounds = L.latLngBounds(
        L.latLng(bbox.maxlat, bbox.minlng),
        L.latLng(bbox.minlat, bbox.maxlng)
      );

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
            click: (event) => {
              layerClickHandler(event);
            },
          }}
        />
      );
    });
  };

  return (
    <>
      {layers.length &&
        layers.map((layer) => {
          return layer;
        })}
      {selectedLayers.length &&
        selectedLayers.map((layer) => {
          return layer;
        })}
    </>
  );
}
