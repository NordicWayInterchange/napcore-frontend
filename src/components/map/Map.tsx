import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import { useMemo } from "react";

type Props = {
  quadtreeCallback?: (value: string[]) => void;
  quadtree: string[];
  interactive?: boolean;
};

export default function Map(props: Props) {
  const { quadtree } = props;

  const DynamicMap = useMemo(
    () =>
      dynamic(() => import("./DynamicMap"), {
        loading: () => <CircularProgress />,
        ssr: false,
      }),
    [quadtree]
  );

  return <DynamicMap {...props} />;
}
