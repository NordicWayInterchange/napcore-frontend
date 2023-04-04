import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { TableContainer as MuiTableContainer } from "@mui/material/";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import StatusChip from "./StatusChip";
import { Capability} from "@/types/capability";
import { Subscription } from "@/types/subscription";

type Props = {
  headers: { property: string; label: string; }[]
  data: Subscription[] | Capability[];
};

const TableComponent = (props: Props) => {
  const { data, headers } = props;

  return (
    <MuiTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header.property} align="right">
                {header.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.map((row, key) => (
              <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
              {headers.map((header) => (
                    <TableCell key={header.property} align="right">
                      {row[header.property]}
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
