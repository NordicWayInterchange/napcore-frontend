import React, { useRef, useState } from "react";
import {
  MapContainer as LeafletContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapComponent from "./MapComponent";

const heightAndWidth = 900;

const bounds = [
  [83.97925949886205, -168.75000000000003],
  [85.0511287798066, -157.50000000000003],
];

export default function MapView() {
  return (
    <LeafletContainer
      center={[51.5072, 0.1275]}
      zoom={4}
      scrollWheelZoom={true}
      style={{ height: heightAndWidth, width: heightAndWidth }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent />
      {/* <Rectangle bounds={bounds} pathOptions={{ color: "red" }} /> */}
    </LeafletContainer>
  );
}
