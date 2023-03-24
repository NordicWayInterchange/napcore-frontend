import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../../../public/nordic-way-logo.png";

const Navbar = () => {
  return (
    <div className="flex flex-col p-4">
      <Image src={logo} alt="Nordic Way logo" width={200} className="m-5" />
      <ul className="m-5">
        <li>
          <Link className="text-xl text-600" href="/">
            Capabilities
          </Link>
        </li>
        <li>
          <Link className="text-xl text-600" href="/deliveries">
            Deliveries
          </Link>
        </li>
        <li>
          <Link className="text-xl text-600" href="/subscriptions">
            Subscriptions
          </Link>
        </li>
        <li>
          <Link className="text-xl text-600" href="/network-capabilities">
            Network Capabilities
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
