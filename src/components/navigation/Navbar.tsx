import Image from "next/image";
import Link from "next/link";
import React from "react";
import Box from "@mui/material/Box";
import logo from "../../../public/nordic-way-logo.png";

const Navbar = () => {
  return (
    <Box sx={{ flexDirection: "column" }}>
      <Image src={logo} alt="Nordic Way logo" width={200} className="m-5" />
      <ul className="m-5">
        <li>
          <Link href="/">Capabilities</Link>
        </li>
        <li>
          <Link href="/deliveries">Deliveries</Link>
        </li>
        <li>
          <Link href="/subscriptions">Subscriptions</Link>
        </li>
        <li>
          <Link href="/network-capabilities">Network Capabilities</Link>
        </li>
      </ul>
    </Box>
  );
};

export default Navbar;
