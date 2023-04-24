import { deleteSubscription } from "@/lib/fetchers";
import { ExtendedCapability } from "@/types/capability";
import { ExtendedSubscription } from "@/types/subscription";
import React from "react";
import ButtonComponent from "../shared/Button";
import InformationText from "./InformationText";

type Props = {
  extendedSubscription: ExtendedSubscription | undefined;
};

export default function SubscriptionDetails({ extendedSubscription }: Props) {
  const handleDeletion = async (name: string, subscriptionId: string) => {
    const data = await deleteSubscription(name, subscriptionId);
    console.log(data.json());
  };

  if (!extendedSubscription) return <InformationText text="subscription" />;

  return (
    <div>
      <p>{extendedSubscription.id}</p>
      <ButtonComponent
        text="Unsubscribe"
        onClick={() => {
          handleDeletion("anna", extendedSubscription.id);
        }}
      />
    </div>
  );
}
