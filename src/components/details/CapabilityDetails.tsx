import React from "react";
import { ExtendedCapability } from "@/types/capability";
import { InformationText } from "./index";
import { ButtonComponent } from "../shared";
import { createSubscription } from "@/lib/internalFetchers";
import { generateSelector } from "@/lib/generateSelector";

type Props = {
  extendedCapability?: ExtendedCapability;
};

export default function CapabilityDetails({ extendedCapability }: Props) {
  if (!extendedCapability) return <InformationText text="capability" />;

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <p>{extendedCapability.messageType}</p>
      <p>{extendedCapability.protocolVersion}</p>
      <p>{extendedCapability.publisherId}</p>
      {/* TODO: Selector builder for creating subscription from capability */}
      <ButtonComponent
        text="Subscribe"
        onClick={() =>
          saveSubscription("anna", generateSelector(extendedCapability))
        }
      />
    </div>
  );
}
