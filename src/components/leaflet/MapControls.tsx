import { TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useMemo } from "react";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

type MapControlsProps = {
  hash: string[];
  quadtree: string[];
};

export default function MapControls({ hash }: MapControlsProps) {
  console.log(hash);

  const inputBar = useMemo(
    () => (
      <Box
        sx={{
          width: 400,
          height: 40,
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography noWrap={true}>{hash && hash.join(", ")}</Typography>
      </Box>
    ),
    [hash]
  );
  return (
    <div className={POSITION_CLASSES.topright}>
      <div className="leaflet-control leaflet-bar">{inputBar}</div>
    </div>
  );
}
