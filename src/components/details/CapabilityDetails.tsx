import React from "react";
import { ExtendedCapability } from "@/types/capability";
import { InformationText } from "./index";

type Props = {
  extendedCapability: ExtendedCapability | undefined;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  if (!extendedCapability) return <InformationText text="capability" />;

  return (
    <div>
      <p>{extendedCapability.messageType}</p>
      <p>{extendedCapability.protocolVersion}</p>
      <p>{extendedCapability.publisherId}</p>
    </div>
  );
}
