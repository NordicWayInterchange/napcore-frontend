import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableContainer as MuiTableContainer } from "@mui/material/";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatusChip from "./StatusChip";
import { Capability } from "@/types/capability";
import { ExtendedSubscription } from "@/types/subscription";
import { TableHeader, TableHeaders } from "@/types/tableHeaders";

type Props = {
  tableHeaders: TableHeaders;
  data: ExtendedSubscription[] | Capability[];
};

const TableComponent = (props: Props) => {
  const { data, tableHeaders } = props;

  return (
    <MuiTableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            {tableHeaders.map((tableHeader: TableHeader, key: number) => (
              <TableCell key={key} align="right">
                {tableHeader.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row, key: number) => (
              <TableRow
                key={key}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {tableHeaders.map((tableHeader: TableHeader) => (
                  <TableCell key={tableHeader.property} align="right">
                    {row[tableHeader.property as keyof typeof row]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </MuiTableContainer>
  );
};

export default TableComponent;
