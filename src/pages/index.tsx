import React from "react";
import Subscriptions from "./subscriptions";
import { Divider } from "@mui/material";
import { useSession } from "next-auth/react";
import { Box } from "@mui/system";
import Link from "next/link";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { SubscriptionDatagrid } from "@/components/shared/datagrid/GridColumns/SubscriptionDatagrid";
import { CustomEmptyOverlaySubscription } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import ShortcutCard from "@/components/shared/display/ShortcutCard";

export default function Home() {
  const { data: session } = useSession();
  const { data, isLoading } = useSubscriptions(
    session?.user.commonName as string
  );

  return (
    <Box flex={1}>
      <Mainheading>Welcome, {session?.user?.name}!</Mainheading>
      <Divider sx={{ marginY: 3 }} />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
        </Box>
        <Subheading>Your latest subscriptions</Subheading>
        <DataGrid
          columns={SubscriptionDatagrid}
          rows={data?.slice(0, 4) || []}
          loading={isLoading}
          hideFooterPagination={true}
          sort={{ field: "id", sort: "desc" }}
          slots={{
            noRowsOverlay: CustomEmptyOverlaySubscription,
          }}
        />
      </Box>
    </Box>
  );
}
