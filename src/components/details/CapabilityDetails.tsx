import { ExtendedCapability } from "@/types/capability";
import React from "react";

type Props = {
  extendedCapability: ExtendedCapability | undefined;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  if (!extendedCapability)
    return <p>Click a capability to display more information</p>;

  return (
    <div>
      <p>{extendedCapability.messageType}</p>
      <p>{extendedCapability.protocolVersion}</p>
      <p>{extendedCapability.publisherId}</p>
    </div>
  );
}
