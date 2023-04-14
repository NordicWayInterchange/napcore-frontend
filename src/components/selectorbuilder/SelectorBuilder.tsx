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
};

let defaultSelector = {
  messageType: [],
  protocolVersion: "",
  originatingCountry: [],
  publisherId: "",
  quadTree: ["2", "123", "8888"],
};

const SelectorBuilder = (props: Props) => {
  const { name, version, capability } = props;
  const isDisabled = !!capability;
  const [selector, setSelector] = useState<string>();
  const [formState, setFormState] = useState(defaultSelector);
  const [errors, setErrors] = useState({}); // TODO: Handle errors

  /*  if (capability) {
    subscription = capability;
  }*/

  useEffect(() => {
    setSelector(generateSelector(formState));
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
      <Grid item xs={6}>
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
      <Grid item xs={6}>
        <Typography variant="h4">Selector</Typography>
        <p>{selector}</p>
      </Grid>
    </Grid>
  );
};

export default SelectorBuilder;
