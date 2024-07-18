import { Box, Button, Divider } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { GridPagination } from "@mui/x-data-grid";
import React from "react";

export const CreateDeliveryFooter = () => {
  return (
    <>
      <Divider />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href={"/deliveries/new-delivery"}
          style={{ textDecoration: "none" }}
        >
          <Button
            sx={{ marginLeft: 2, borderRadius: 100, textTransform: "none" }}
            startIcon={<AddIcon />}
            color={"buttonThemeColor"}
            variant={"outlined"}
          >
            Create delivery
          </Button>
        </Link>
        <GridPagination />
      </Box>
    </>
  );
};
