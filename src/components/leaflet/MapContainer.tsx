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
      center={[0, 0]}
      zoom={1}
      scrollWheelZoom={false}
      style={{ height: 900, width: 1200 }}
    >
      <TileLayer
        noWrap={true}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapComponent />
    </LeafletContainer>
  );
}
