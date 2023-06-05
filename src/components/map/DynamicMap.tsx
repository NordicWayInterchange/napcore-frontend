import React, { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import QuadtreeGenerator from "./quadtree/QuadtreeGenerator";
import SubscriptionControls from "./controls/SubscriptionControls";
import { latLngBounds } from "leaflet";

type Props = {
  quadtreeCallback?: (value: string[]) => void;
  quadtree: string[];
  interactive?: boolean;
  width: string;
  height: number;
};

export default function DynamicMap(props: Props) {
  const { quadtreeCallback, quadtree, interactive, width, height } = props;
  const [controlsHash, setControlsHash] = useState<string[]>([]);

  const controlsCallback = (hash: string) => {
    setControlsHash([hash]);
  };

  const DEFAULT_ZOOM = 1;
  const MAX_BOUNDS = latLngBounds([
    [-90, -180],
    [90, 180],
  ]);

  return (
    <MapContainer
      center={[0, 0]}
      zoom={DEFAULT_ZOOM}
      maxBounds={MAX_BOUNDS}
      scrollWheelZoom={true}
      style={{ height: height, width: width }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <QuadtreeGenerator
        controlsCallback={controlsCallback}
        quadtree={quadtree}
        quadtreeCallback={quadtreeCallback}
        interactive={interactive}
      />
      {interactive && (
        <SubscriptionControls controlsHash={controlsHash} quadtree={quadtree} />
      )}
    </MapContainer>
  );
}
