import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Subscriptions } from "@/types/subscription";
import TableDialog from "../dialog/TableDialog";
import { filterMockData } from "@/mock/filters";
import TableComponent from "./TableComponent";
import ButtonComponent from "../ButtonComponent";
import { Capabilities, Capability } from "@/types/capability";

type Props = {
  headers: { property: string; label: string }[];
  subscriptions?: Subscriptions | undefined;
  capabilities?: Capabilities | undefined;
};

export default function TableContainer(props: Props) {
  const { headers, subscriptions, capabilities } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

  let data;
  if (subscriptions) data = subscriptions.subscriptions;
  if (capabilities) data = capabilities.capabilities;

  const handleClear = (): void => {
    setFilters([]);
    setOpen(false);
  };

  const handleApply = (): void => {
    setOpen(false);
  };

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const searchColumns = (rows: Subscriptions) => {
    const columns = rows[0] && Object.keys(rows[0]);
    return rows.filter((row) =>
      columns.some(
        // FIXME: Element implicitly has an 'any'
        (column) =>
          row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
          -1
        // filters.includes(row[column].toString().toLowerCase())
      )
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target;

    if (checked) {
      setFilters([...filters, value]);
    } else {
      setFilters(filters.filter((p) => p !== value));
    }
  };

  return (
    <Box>
      <Box sx={{ flexDirection: "row" }}>
        <ButtonComponent text={"Filter +"} onClick={handleClickOpen} />
        {filters.length == 0 ? null : (
          <ButtonComponent text={"Clear"} onClick={handleClear} />
        )}
        <TableDialog
          filters={filters}
          handleChange={handleChange}
          handleApply={handleApply}
          handleClear={handleClear}
          data={filterMockData}
          open={open}
        />
        <TextField
          sx={{ width: 400 }}
          id="outlined-basic"
          size="small"
          label="Search ..."
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <TableComponent headers={headers} data={data} />
    </Box>
  );
}
