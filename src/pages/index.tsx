import dynamic from "next/dynamic";
import { useMemo } from "react";
import Subscriptions from "./subscriptions";

export default function Home() {
  const Map = useMemo(
    () =>
      dynamic(() => import("../components/leaflet/MapView"), {
        loading: () => <p>A map is loading</p>,
        ssr: false,
      }),
    [
      /* list variables which should trigger a re-render */
    ]
  );
  return <Map />;
}
