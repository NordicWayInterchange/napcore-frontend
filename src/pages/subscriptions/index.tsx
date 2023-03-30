import React from "react";
import { Box, Button, Typography } from "@mui/material";
import TableContainer from "@/components/table/TableContainer";
import Link from "next/link";
import styles from "../../styles/Link.module.css";

const subscriptions = () => {
  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <Button variant="contained">Create Subscription</Button>
      </Link>
      <TableContainer />
    </Box>
  );
};

export default subscriptions;
