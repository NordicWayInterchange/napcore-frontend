import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { Subscription, Subscriptions } from "@/types/subscription";
import TableDialog from "../dialog/TableDialog";
import { filterMockData } from "@/mock/filters";
import TableComponent from "./TableComponent";
import ButtonComponent from "../ButtonComponent";
import { Capabilities, Capability } from "@/types/capability";

type Props = {
  headers: { property: string; label: string }[];
  subscriptions?: Subscription[];
  capabilities?: Capability[];
};

export default function TableContainer(props: Props) {
  const { headers, subscriptions, capabilities } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

  let data = [];
  if (subscriptions) data = subscriptions;
  if (capabilities) data = capabilities;

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

  const searchColumns = (rows, headers) => {
    const columns = headers.map(header => header.property)

    return rows?.filter((row) =>
      columns.some(
        // FIXME: Element implicitly has an 'any'
        (column: string) => {
          return row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
          -1
        }
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
      <Box>
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
          className={styles.textField}
          id="outlined-basic"
          size="small"
          label="Search ..."
          variant="outlined"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <TableComponent headers={headers} data={searchColumns(data, headers)} />
    </Box>
  );
}
