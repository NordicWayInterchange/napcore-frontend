import React, { useState } from "react";
import { MapContainer as LeafletContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapComponent from "./MapComponent";
import MapControls from "./MapControls";
import { latLngBounds } from "leaflet";

type Props = {
  quadtreeCallback?: (value: string[]) => void;
  quadtree: string[];
  interactive?: boolean;
};

const ZOOM = 2;
const BOUNDS = latLngBounds([
  [-90, -180],
  [90, 180],
]);

export default function MapView({
  quadtreeCallback,
  quadtree,
  interactive,
}: Props) {
  const [controlsHash, setControlsHash] = useState<string[]>([]);

  const controlsCallback = (hash: string) => {
    setControlsHash([hash]);
  };

  return (
    <LeafletContainer
      center={[0, 0]}
      zoom={ZOOM}
      maxBounds={BOUNDS}
      scrollWheelZoom={true}
      style={{ height: 900, width: 1200 }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent
        quadtree={quadtree}
        quadtreeCallback={quadtreeCallback}
        controlsCallback={controlsCallback}
        interactive={interactive}
      />
      <MapControls controlsHash={controlsHash} quadtree={quadtree} />
    </LeafletContainer>
  );
}
