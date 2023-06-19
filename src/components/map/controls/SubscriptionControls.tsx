import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useMemo } from "react";
import { POSITIONS } from "@/components/map/controls/Positions";

type MapControlsProps = {
  controlsHash: string[];
  quadtree: string[];
};

export default function SubscriptionControls({
  controlsHash,
  quadtree,
}: MapControlsProps) {
  let hash: string[];

  if (quadtree?.length && !controlsHash?.length) {
    hash = quadtree;
  } else {
    hash = controlsHash;
  }

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
          p: 3,
        }}
      >
        <Typography noWrap={true}>{hash && hash.join()}</Typography>
      </Box>
    ),
    [hash]
  );
  return (
    <div className={POSITIONS.topright}>
      <div className="leaflet-control leaflet-bar">{inputBar}</div>
    </div>
  );
}
