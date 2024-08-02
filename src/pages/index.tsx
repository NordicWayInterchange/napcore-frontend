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

  const shortcuts = [
    {
      header: "Subscriptions",
      description: "View subscriptions",
      url: "/subscriptions",
      avatar: "S",
    },
    {
      header: "Network capabilities",
      description: "View network capabilities",
      url: "network-capabilities",
      avatar: "C",
    },
    {
      header: "My capabilities",
      description: "View my capabilities",
      url: "capabilities",
      avatar: "M",
    },
    {
      header: "Deliveries",
      description: "View deliveries",
      url: "/deliveries",
      avatar: "D",
    },
    {
      header: "Certificate",
      description: "Generate certificate",
      url: "/certificate",
      avatar: "P",
    },
  ];

  return (
    <Box flex={1}>
      <Mainheading>Welcome, {session?.user?.name}!</Mainheading>
      <Divider sx={{ marginY: 3 }} />
      <Subheading>Shortcuts</Subheading>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {shortcuts.map((shortcut, key) => (
            <Link
              key={key}
              href={shortcut.url}
              style={{
                textDecoration: "none",
                marginRight: 10,
                marginTop: 10,
                width: "400px",
              }}
            >
              <ShortcutCard
                avatar={shortcut.avatar}
                header={shortcut.header}
                description={shortcut.description}
              />
            </Link>
          ))}
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
