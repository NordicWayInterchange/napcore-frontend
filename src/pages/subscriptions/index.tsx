import React from "react";
import { Box, Typography } from "@mui/material";
import TableContainer from "@/components/table/TableContainer";
import Link from "next/link";
import styles from "../../styles/Link.module.css";
import ButtonComponent from "@/components/ButtonComponent";
import {useSubscriptions} from "@/hooks/useSubscriptions";

const Subscriptions = () => {
    const { data, isLoading, isFetching } = useSubscriptions("anna");

    return (
    <Box>
      <Typography variant="h4">Subscription</Typography>
      <Link className={styles.link} href="/subscriptions/new-subscription">
        <ButtonComponent text={"Create Subscription"} />
      </Link>
      <TableContainer />
    </Box>
  );
};

export default Subscriptions;
