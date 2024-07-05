import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Link from "next/link";
import { IPages } from "@/interface/IPages";
import HouseIcon from "@mui/icons-material/House";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import CellTowerIcon from "@mui/icons-material/CellTower";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import AddCircleIcon from "@mui/icons-material/AddCircle";

const MAIN_PAGES: Array<IPages> = [
  { text: "Home", url: "/", icon: <HouseIcon /> },
  { text: "Subscriptions", url: "/subscriptions", icon: <SubscriptionsIcon /> },
  { text: "Add subscriptions", url: "/subscriptions/new-subscription", icon: <AddCircleIcon /> },

  {
    text: "Network capabilities",
    url: "/network-capabilities",
    icon: <CellTowerIcon />
  },
  {
    text: "Deliveries",
    url: "/network-capabilities",
    icon: <LocalPostOfficeIcon />
  },
  {
    text: "Certificate",
    url: "/certificate",
    icon: <SettingsIcon />
  }
];

export default function TabMenu() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", marginTop: "70px" }}>
      <Tabs value={value} onChange={handleChange} centered TabIndicatorProps={{
        style: {
          backgroundColor: "#3E7B1F"
        }
      }}>
        {MAIN_PAGES.map((pages, key) => (

          <Tab
            icon={pages.icon}
            label={pages.text}
            key={key}
            component={Link}
            href={pages.url}
          />
        ))}
      </Tabs>

    </Box>
  );
}

