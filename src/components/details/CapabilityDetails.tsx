import React from "react";
import { ExtendedCapability } from "@/types/capability";
import { InformationText } from "./index";
import { ButtonComponent } from "../shared";

type Props = {
  extendedCapability: ExtendedCapability | undefined;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  console.log(extendedCapability);

  if (!extendedCapability) return <InformationText text="capability" />;

  return (
    <div>
      <p>{extendedCapability.messageType}</p>
      <p>{extendedCapability.protocolVersion}</p>
      <p>{extendedCapability.publisherId}</p>
      {/* TODO: Selector builder for creating subscription from capability */}
      <ButtonComponent text="Subscribe" />
    </div>
  );
}
