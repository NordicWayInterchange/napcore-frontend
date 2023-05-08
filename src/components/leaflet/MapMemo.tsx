import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

type Props = {
  quadtreeCallback: (value: string[]) => void;
  quadtree: string[];
};

export default function MapMemo({ quadtreeCallback, quadtree }: Props) {
  const Map = useMemo(
    () =>
      dynamic(() => import("./MapContainer"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return <Map quadtree={quadtree} quadtreeCallback={quadtreeCallback} />;
}
