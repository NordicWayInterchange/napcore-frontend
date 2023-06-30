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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quadtree]
  );

  return <DynamicMap {...props} />;
}
