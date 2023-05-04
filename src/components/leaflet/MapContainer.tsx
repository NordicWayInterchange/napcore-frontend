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

export default function MapView() {
  return (
    <LeafletContainer
      center={[51.5072, 0.1275]}
      zoom={0}
      scrollWheelZoom={false}
      style={{ height: 900, width: 1200 }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent />
    </LeafletContainer>
  );
}
