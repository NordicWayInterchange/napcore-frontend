import React, { useState } from "react";
import ButtonComponent from "../shared/Button";
import { ExtendedSubscription } from "@/types/subscription";
import { InformationText, AlertDialog } from "./index";

type Props = {
  extendedSubscription: ExtendedSubscription | undefined;
};

export default function SubscriptionDetails({ extendedSubscription }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  if (!extendedSubscription) return <InformationText text="subscription" />;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
  };

  return (
    <div>
      <p>{extendedSubscription.id}</p>
      <ButtonComponent text="Unsubscribe" onClick={handleClickOpen} />
      <AlertDialog
        open={open}
        actorCommonName={"anna"}
        subscriptionId={extendedSubscription.id}
        handleDialog={handleClickClose}
      />
    </div>
  );
}
