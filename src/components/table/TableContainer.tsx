import React, { useState } from "react";
import { TextField, Box } from "@mui/material";
import { mockData } from "../../mock/subs";
import { Subscriptions } from "@/interfaces/subscription";
import TableDialog from "../dialog/TableDialog";
import { filterMockData } from "../../mock/filters";
import TableComponent from "./TableComponent";
import ButtonComponent from "../ButtonComponent";
import styles from "@/styles/Table.module.css"

export default function TableContainer() {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);

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
        headers={["ID", "Message Type", "Originating Country", "Status"]}
        data={searchColumns(mockData)}
      />
    </Box>
  );
}
