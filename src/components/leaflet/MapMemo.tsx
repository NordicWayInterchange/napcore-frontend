import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

type Props = {
  quadtree: (value: string) => void;
};

export default function MapMemo({ quadtree }: Props) {
  const Map = useMemo(
    () =>
      dynamic(() => import("./MapContainer"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    []
  );

  return <Map quadtree={quadtree} />;
}
