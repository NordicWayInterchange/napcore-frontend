import React from "react";
import ButtonComponent from "../shared/Button";
import { ExtendedSubscription } from "@/types/subscription";
import { InformationText, AlertDialog } from "./index";

type Props = {
  extendedSubscription: ExtendedSubscription | undefined;
};

export default function SubscriptionDetails({ extendedSubscription }: Props) {
  const [open, setOpen] = React.useState(false);

  if (!extendedSubscription) return <InformationText text="subscription" />;

  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <p>{extendedSubscription.id}</p>
      <ButtonComponent text="Unsubscribe" onClick={handleClickOpen} />
      <AlertDialog
        open={open}
        setOpen={setOpen}
        actorCommonName={"anna"}
        subscriptionId={extendedSubscription.id}
      />
    </div>
  );
}
