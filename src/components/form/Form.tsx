import { Capability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import { Box, SelectChangeEvent } from "@mui/material";
import React, { useState } from "react";
import InputComponent from "./InputComponent";
import SelectComponent from "./SelectComponent";

type Props = {
  name: string;
  version: string;
  capability?: Capability;
};

const Form = (props: Props) => {
  const { name, version, capability } = props;
  const isDisabled = !!capability;

  let subscription = {
    messageType: "",
    protocolVersion: "",
    originatingCountry: "",
    publisherId: "",
  };

  if (capability) {
    subscription = capability;
  }

  const [subscriptionData, setSubscriptionData] = useState(subscription);
  // TODO: Handle errors
  const [errors, setErrors] = useState({});

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setSubscriptionData((prevData) => ({ ...prevData, [name]: value }));
  };

  // TODO: Handle onSave
  const onSave = () => {};

  console.log(subscriptionData);

  return (
    <Box>
      <SelectComponent
        isDisabled={isDisabled}
        value={subscriptionData.messageType}
        label={"Message Type"}
        name={"messageType"}
        data={MessageTypes}
        onChange={handleChange}
      />
      {/* TODO: REGEX to check format */}
      <InputComponent
        isDisabled={isDisabled}
        value={subscriptionData.protocolVersion}
        name={"protocolVersion"}
        label="Protocol Version"
        onChange={handleChange}
      />
      <SelectComponent
        isDisabled={isDisabled}
        value={subscriptionData.originatingCountry}
        label={"Originating Country"}
        name={"originatingCountry"}
        data={OriginatingCountry}
        onChange={handleChange}
      />
      <InputComponent
        isDisabled={isDisabled}
        value={subscriptionData.publisherId}
        name={"publisherId"}
        label="Publisher ID"
        onChange={handleChange}
      />
    </Box>
  );
};

export default Form;
