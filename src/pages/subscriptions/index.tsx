import React, { useEffect, useState } from "react";
import { Box, Checkbox, Divider, IconButton, Tooltip } from "@mui/material";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { dataGridTemplate } from "@/components/shared/datagrid/DataGridTemplate";
import DataGrid from "@/components/shared/datagrid/DataGrid";
import { statusChips } from "@/lib/statusChips";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteSubDialog from "@/components/shared/actions/DeleteSubDialog";
import { ExtendedSubscription } from "@/types/subscription";
import { CustomFooter } from "@/components/shared/datagrid/CustomFooter";
import { Chip } from "@/components/shared/display/Chip";
import { timeConverter } from "@/lib/timeConverter";
import { CustomEmptyOverlaySubscription } from "@/components/shared/datagrid/CustomEmptyOverlay";
import Mainheading from "@/components/shared/display/typography/Mainheading";
import Subheading from "@/components/shared/display/typography/Subheading";
import CommonDrawer from "@/components/layout/CommonDrawer";
import AddButton from "@/components/shared/actions/AddButton";
import { performRefetch } from "@/lib/performRefetch";
import { useQueryClient } from "@tanstack/react-query";
import SearchBox from "@/components/shared/SearchBox";
import MultipleDeleteSubDialog from "@/components/shared/actions/MultipleDeleteSubDialog";

export default function Subscriptions() {
  const { data: session } = useSession();
  const { data, isLoading, refetch} = useSubscriptions(
    session?.user?.commonName as string
  );
  const [open, setOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [subscriptionRow, setSubscriptionRow] =
    useState<ExtendedSubscription>();
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [shouldRefreshAfterDelete, setShouldRefreshAfterDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const [searchId, setSearchId] = useState("");
  const [subRows, setSubRows] = React.useState<ExtendedSubscription[]>([]);
  const [selectedSubscriptionIds, setSelectedSubscriptionIds] = useState(() => new Set<string>());
  const [selectedSubscriptionIdsRow, setSelectedSubscriptionIdsRow] =  useState<string>("");

  const isAllCheckboxSelected = subRows.length > 0 && selectedSubscriptionIds.size === subRows.length;


  useEffect(() => {
    if (isDeleted) {
      performRefetch(refetch);
      setIsDeleted(false);
      setShouldRefreshAfterDelete(true);
    }
  }, [isDeleted, refetch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      performRefetch(refetch);
    }, 20000);
    setShouldRefreshAfterDelete(false);
    return () => {
      clearTimeout(timeout);
    };
  }, [shouldRefreshAfterDelete, refetch]);

  const handleMore = (subscription: ExtendedSubscription) => {
    setSubscriptionRow(subscription);
    setDrawerOpen(true);
  };

  const handleMoreClose = () => {
    setDrawerOpen(false);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
    queryClient.removeQueries({ queryKey: ['subscriptions'] });
  };

  const handleOnRowClick = (params: any) => {
    handleMore(params.row);
  };

  const handleDeletedItem = (deleted: boolean) => {
    setIsDeleted(deleted);
  };

  const rows = Array.isArray(data) ? data : [];

  const filteredSubscriptionRows = searchId.trim()
    ? rows.filter((row) =>
      row.id?.toString().includes(searchId.trim())
    )
    : rows;

  const tableHeaders: GridColDef[] = [
    {
      field: 'select',
      headerName: '',
      width: 80,
      sortable: false,
      disableColumnMenu: true,
      renderHeader: () => (
        <Box display="flex" alignItems="left">
          <Checkbox
            checked={isAllCheckboxSelected}
            indeterminate={selectedSubscriptionIds.size > 0 && !isAllCheckboxSelected}
            onChange={(event) => handleToggleAll(event)}
          />
          <Tooltip title="Delete selected subscriptions">
            <span>
              <IconButton
                sx={{ ml: '-10px', mt: '1px' }}
                onClick={handleCheckboxDelete}
                disabled={selectedSubscriptionIds.size === 0}
              >
                <DeleteIcon fontSize="medium" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={selectedSubscriptionIds.has(params.row.id)}
          onChange={(event) => handleCheckboxChange(params.row.id, event)}
        />
      ),
    },
    {
      ...dataGridTemplate,
      field: "id",
      headerName: "ID",
      renderCell: (params) => {
        const value = params.row.id;
        return value ? value.substring(0, 8) : '';
      },
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
      field: "description",
      headerName: "Description",
      flex: 2,
    },
    {
      ...dataGridTemplate,
      field: "lastStatusChange",
      headerName: "Last status change",
      renderCell: (params) => {
        const value = params.row.lastStatusChange;
        return value && timeConverter(value);
      },
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
            <IconButton onClick={() => handleMore(params.row)}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleToggleAll = ( event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const allSubscriptionIds = rows.map((r) => r.id);
    const currentSubscriptionSelected = new Set(selectedSubscriptionIds);
    const isAllCurrentlySelected = allSubscriptionIds.every((id) => currentSubscriptionSelected.has(id));

    if (isAllCurrentlySelected) {
      setSelectedSubscriptionIds(new Set<string>());
    } else {
      const allSubscriptionIds = rows.map((r) => r.id);
      setSelectedSubscriptionIds(new Set<string>(allSubscriptionIds));
    }
  };

  const handleCheckboxChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    setDrawerOpen(false);
    setSelectedSubscriptionIds((prev) => {
      const newSet = new Set<string>(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleCheckboxDelete = () => {
    const ids = Array.from(selectedSubscriptionIds);

    const idString = ids.join(",");
    setSelectedSubscriptionIdsRow(idString);
    setOpen(true);
    setSelectedSubscriptionIds(new Set<string>());
  };

  return (
    <Box flex={1}>
      <Mainheading>Subscriptions</Mainheading>
      <Subheading>
        These are all of your subscriptions. You can click a subscription to
        see details or unsubscribe.
      </Subheading>
      <Divider sx={{ marginY: 2 }} />
      <Box display="flex" flexDirection="row" gap={5}>
      <AddButton text="Add subscription" labelUrl="subscription"></AddButton>
      <SearchBox searchId={searchId} setSearchId={setSearchId} label="subscription" searchElement="ID"/>
      </Box>
      <Divider style={{ margin: '5px 0', visibility: 'hidden' }}/>
      <DataGrid
        columns={tableHeaders}
        rows={filteredSubscriptionRows || []}
        onRowClick={handleOnRowClick}
        loading={isLoading}
        slots={{
          footer: CustomFooter,
          noRowsOverlay: CustomEmptyOverlaySubscription
        }}
        sort={{ field: "lastStatusChange", sort: "desc" }}
      />
      {subscriptionRow && (
        <CommonDrawer
          handleMoreClose={handleMoreClose}
          open={drawerOpen}
          item={subscriptionRow as ExtendedSubscription}
          handleDeletedItem={handleDeletedItem}
          label="Subscription"
        />
      )}
      <DeleteSubDialog
        itemId={subscriptionRow?.id as string}
        handleDialog={handleClickClose}
        open={open}
        actorCommonName={session?.user.commonName as string}
        handleDeletedItem={handleDeletedItem}
        text="Subscription"
        handleMoreClose={handleMoreClose}
      />

      <MultipleDeleteSubDialog
        itemId={selectedSubscriptionIdsRow as string}
        handleDialog={handleClickClose}
        open={open}
        actorCommonName={session?.user.commonName as string}
        handleDeletedItem={handleDeletedItem}
        handleMoreClose={handleMoreClose}
      />
    </Box>
  );
}