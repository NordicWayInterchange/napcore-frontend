import React, { useState } from "react";
import { Box, Divider, IconButton } from "@mui/material";
import { useDeliveries } from "@/hooks/useDeliveries";
import { GridColDef } from "@mui/x-data-grid";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import { useSession } from "next-auth/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {statusChips } from "@/lib/statusChips";
import { Chip } from "@/components/shared/display/Chip";
import { CustomEmptyOverlayDeliveries } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import { timeConverter } from "@/lib/timeConverter";
import { ExtendedDelivery } from "@/types/delivery";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import CommonDrawer from "@/components/layout/CommonDrawer";
import { CustomFooter } from "@/components/shared/datagrid/CustomFooter";
import AddButton from "@/components/shared/actions/AddButton";

export default function Deliveries() {
  const { data: session } = useSession();
  const { data, isLoading, remove } = useDeliveries(
    session?.user.commonName as string
  );
  const [open, setOpen] = useState<boolean>(false);
  const [deliveryRow, setDeliveryRow] = useState<ExtendedDelivery>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDelete = (delivery: ExtendedDelivery) => {
    setDeliveryRow(delivery);
    setOpen(true);
  };

  const handleMore = (delivery: ExtendedDelivery) => {
    setDeliveryRow(delivery);
    setDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
    remove();
  };

  const tableHeaders: GridColDef[] = [
    {
      ...dataGridTemplate,
      field: "id",
      headerName: "ID",
    },
    {
      ...dataGridTemplate,
      field: "status",
      headerName: "Status",
      renderCell: (cell) => {
        return (
          <Chip
            color={statusChips[cell.value as keyof typeof statusChips] as any}
            label={cell.value}
          />
        );
      },
    },
    {
      ...dataGridTemplate,
      field: "capabilityMatches",
      headerName: "Capability matches",
    },
    {
      ...dataGridTemplate,
      field: "lastUpdatedTimestamp",
      headerName: "Last updated",
      valueGetter: ({ value }) => value && timeConverter(value),
    },
    {
      ...dataGridTemplate,
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      align: "right",
      renderCell: (params) => {
        return (
          <Box>
            <IconButton onClick={() => handleDelete(params.row)}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => handleMore(params.row)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };


  return (
    <Box flex={1}>
      <Mainheading>Deliveries</Mainheading>
      <Subheading>
        These are all of the deliveries in the network. You can click a
        delivery to view more information and create a delivery.
      </Subheading>
      <Divider sx={{ marginY: 2 }} />
      <AddButton text="Create delivery" labelUrl="delivery"></AddButton>
      <Divider style={{ margin: '5px 0', visibility: 'hidden' }}/>
      <DataGrid
        columns={tableHeaders}
        rows={data || []}
        onRowClick={handleOnRowClick}
        loading={isLoading}
        getRowId={(row) => row.id}
        sort={{ field: "lastUpdatedTimestamp", sort: "desc" }}
        slots={{
          footer: CustomFooter,
          noRowsOverlay: CustomEmptyOverlayDeliveries,
        }}
      />
      {deliveryRow && (
        <CommonDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          item={deliveryRow as ExtendedDelivery}
          label="Delivery"
        />
      )}
      <DeleteSubDialog
        itemId={deliveryRow?.id as string}
        handleDialog={handleClickClose}
        open={open}
        actorCommonName={session?.user.commonName as string}
        text="Delivery"
      />
    </Box>
  );
}
