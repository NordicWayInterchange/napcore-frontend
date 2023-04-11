import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { ExtendedSubscription } from "@/types/subscription";
import TableDialog from "../dialog/TableDialog";
import { filterMockData } from "@/mock/filters";
import TableComponent from "./TableComponent";
import ButtonComponent from "../ButtonComponent";
import { Capability } from "@/types/capability";
import styles from "@/styles/Table.module.css";
import { TableHeader, TableHeaders } from "@/types/tableHeaders";

type Props = {
  tableHeaders: TableHeaders;
  subscriptions?: ExtendedSubscription[];
  capabilities?: Capability[];
};

export default function TableContainer(props: Props) {
  const { tableHeaders, subscriptions, capabilities } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

  let data: ExtendedSubscription[] | Capability[] = [];
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

  const searchColumns = (rows: any[], tableHeaders: TableHeaders) => {
    const columns = tableHeaders.map((header: TableHeader) => header.property);

    return rows?.filter((row) =>
      columns.some(
        // FIXME: Element implicitly has an 'any'
        (column: string) => {
          return (
            row[column].toString().toLowerCase().indexOf(search.toLowerCase()) >
            -1
          );
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
      <TableComponent
        tableHeaders={tableHeaders}
        data={searchColumns(data, tableHeaders)}
      />
    </Box>
  );
}
