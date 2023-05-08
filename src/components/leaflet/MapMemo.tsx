import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function MapMemo() {
  const Map = useMemo(
    () =>
      dynamic(() => import("./MapContainer"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [
      /* list variables which should trigger a re-render */
    ]
  );
  return <Map />;
}
