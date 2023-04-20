import { Capability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import { Grid, SelectChangeEvent, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import InputComponent from "./InputComponent";
import SelectComponent from "./SelectComponent";
import { generateSelector } from "@/lib/generateSelector";

type Props = {
  name: string;
  version: string;
  capability?: Capability;
  selectorCallback: (selector: string) => void;
};

let defaultSelector = {
  messageType: [],
  protocolVersion: "",
  originatingCountry: [],
  publisherId: "",
  quadTree: [],
};

const SelectorBuilder = (props: Props) => {
  const { name, version, capability, selectorCallback } = props;
  const isDisabled = !!capability;
  const [selector, setSelector] = useState<string>();
  const [formState, setFormState] = useState(defaultSelector);
  const [errors, setErrors] = useState({}); // TODO: Handle errors

  useEffect(() => {
    const selector = generateSelector(formState);
    setSelector(selector);
    selectorCallback(selector);
  }, [formState]);

  const handleChange = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setFormState((prevData) => ({ ...prevData, [name]: value }));
    //setSelector(createSelector(subscriptionData));
  };

  // TODO: Handle onSave
  const onSave = () => {};

  return (
    <Grid container>
      <Typography variant="h4">Form</Typography>
      <SelectComponent
        isDisabled={isDisabled}
        value={formState.messageType}
        label={"Message Type"}
        name={"messageType"}
        data={MessageTypes}
        onChange={handleChange}
      />
      {/* TODO: REGEX to check format */}
      <InputComponent
        isDisabled={isDisabled}
        value={formState.protocolVersion}
        name={"protocolVersion"}
        label="Protocol Version"
        onChange={handleChange}
      />
      <SelectComponent
        isDisabled={isDisabled}
        value={formState.originatingCountry}
        label={"Originating Country"}
        name={"originatingCountry"}
        data={OriginatingCountry}
        onChange={handleChange}
      />
      <InputComponent
        isDisabled={isDisabled}
        value={formState.publisherId}
        name={"publisherId"}
        label="Publisher ID"
        onChange={handleChange}
      />
    </Grid>
  );
};

export default SelectorBuilder;
