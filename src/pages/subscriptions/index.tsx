import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import TableContainer from "@/components/table/TableContainer";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import ButtonComponent from "@/components/ButtonComponent";
import { useSubscriptions } from "@/hooks/useSubscriptions";

const Subscriptions = () => {
  const { data, isLoading, isFetching } = useSubscriptions("anna");

  const headers = [
    { property: "id", label: "ID" },
    { property: "consumerCommonName", label: "Consumer Common Header" },
    { property: "status", label: "Status" },
  ];

  return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <TableContainer headers={headers} subscriptions={data} />
      )}
    </Box>
  );
};

export default Subscriptions;
