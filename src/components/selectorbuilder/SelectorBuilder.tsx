import { Capability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import { Grid, SelectChangeEvent, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import TextField from "./TextField";
import Select from "./Select";
import { generateSelector } from "@/lib/generateSelector";
import TextArea from "./TextArea";
import { ButtonComponent } from "../shared";
import { denmCauseCodes } from "@/lib/denmCauseCodes";

type Props = {
  name: string;
  version: string;
  capability?: Capability;
  selectorCallback: (selector: string) => void;
};

let defaultSelector = {
  messageType: [],
  causeCodes: [],
  protocolVersion: "",
  originatingCountry: [],
  publisherId: "",
  quadTree: [],
};

const DENM = MessageTypes.DENM;

const SelectorBuilder = (props: Props) => {
  const { name, version, capability, selectorCallback } = props;
  const [selector, setSelector] = useState<string>();
  const [formState, setFormState] = useState(defaultSelector);
  const [errors, setErrors] = useState({}); // TODO: Handle errors
  const [showCauseCode, setShowCauseCode] = useState<boolean>();
  const [advancedMode, setAdvancedMode] = useState<boolean>(true);

  useEffect(() => {
    const selector = generateSelector(formState);
    setSelector(selector);
    selectorCallback(selector);
  }, [formState]);

  const handleSelect = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setFormState((prevData) => ({ ...prevData, [name]: value }));
    //setSelector(createSelector(subscriptionData));
  };

  const handleTextField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleAdvancedMode = () => {
    setAdvancedMode((prevCheck) => !prevCheck);
    console.log(advancedMode);
  };

  // TODO: Handle onSave
  const onSave = () => {};

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Select
          value={formState.messageType}
          label={"Message Type"}
          name={"messageType"}
          data={MessageTypes}
          onChange={handleSelect}
          disabled={advancedMode}
        />
      </Grid>
      {formState.messageType.includes(DENM) && (
        <Grid item xs={6}>
          <Select
            value={formState.causeCodes}
            label={"Cause Codes"}
            name={"causeCode"}
            data={denmCauseCodes}
            onChange={handleSelect}
            disabled={advancedMode}
          />
        </Grid>
      )}
      <Grid item xs={6}>
        <TextField
          value={formState.protocolVersion}
          name={"protocolVersion"}
          label="Protocol Version"
          onChange={handleTextField}
          disabled={advancedMode}
        />
      </Grid>
      <Grid item xs={6}>
        <Select
          value={formState.originatingCountry}
          label={"Originating Country"}
          name={"originatingCountry"}
          data={OriginatingCountry}
          onChange={handleSelect}
          disabled={advancedMode}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={formState.publisherId}
          name={"publisherId"}
          label="Publisher ID"
          onChange={handleTextField}
          disabled={advancedMode}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          value={formState.quadTree}
          label={"Quadtree"}
          name={"quadTree"}
          onChange={handleTextField}
          disabled={advancedMode}
        />
      </Grid>
      <Grid item xs={12}>
        <TextArea value={selector} disabled={!advancedMode} />
      </Grid>
      <Grid item>
        <ButtonComponent text={"Advanced mode"} onClick={handleAdvancedMode} />
      </Grid>
      <Grid item>
        <ButtonComponent text={"Save Subscription"} />
      </Grid>
    </Grid>
  );
};

export default SelectorBuilder;
