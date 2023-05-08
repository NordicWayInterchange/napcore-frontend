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
import { createSubscription } from "@/lib/internalFetchers";
import { Subscription } from "@/types/napcore/subscription";
import { green, red } from "@mui/material/colors";
import MapDialog from "../leaflet/MapDialog";

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
  const [selector, setSelector] = useState<string>("");
  const [formState, setFormState] = useState(defaultSelector);
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [persistSelector, setPersistSelector] = useState<string>("");
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>();
  const [open, setOpen] = useState<boolean>(false);

  /*
  Generate a new selector when the form state changes.
  Send the selector backwards via selectorCallback(selector) to find matching capabilities.
  */
  useEffect(() => {
    const selector = generateSelector(formState);
    setSelector(selector);
    selectorCallback(selector);
  }, [formState]);

  const handleSelect = (event: SelectChangeEvent<unknown>) => {
    const { name, value } = event.target;
    setFormState((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTextField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTextArea = (event: any) => {
    const value = event.target.value;
    setSelector(value);
    //selectorCallback(selector);
  };

  /* 
  Switching to advanced mode will persist the selector.
  When turning off advanced mode, the selector will be set to the persisted value.
  */
  const handleAdvancedMode = () => {
    setAdvancedMode((prevCheck) => !prevCheck);
    if (!advancedMode) {
      setPersistSelector(selector);
    } else {
      setSelector(persistSelector);
    }
  };

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setFormState((prevData) => ({
      ...prevData,
      quadTree: predefinedQuadtree,
    }));
    setOpen(false);
    console.log(formState);
  };

  const handleQuadtree = (value: string[]) => {
    console.log("QUADTREE VALUE", value);
    setPredefinedQuadtree(value);
  };

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
      {/* FIXME */}
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
          name={"quadtree"}
          label={"Quadtree"}
          disabled={true}
        />
      </Grid>
      <Grid item xs={12}>
        <TextArea
          value={selector}
          disabled={!advancedMode}
          onChange={handleTextArea}
        />
      </Grid>
      <Grid item>
        <ButtonComponent
          color={advancedMode ? "error" : "success"}
          text={"Advanced mode"}
          onClick={handleAdvancedMode}
        />
      </Grid>
      <Grid item>
        <ButtonComponent
          text={"Save Subscription"}
          onClick={() => saveSubscription(name, selector)}
        />
      </Grid>
      <Grid item>
        <ButtonComponent text={"Quadtree"} onClick={handleClickOpen} />
      </Grid>
      <MapDialog
        open={open}
        onClose={handleClose}
        quadtree={formState.quadTree}
        quadtreeCallback={handleQuadtree}
      />
    </Grid>
  );
};

export default SelectorBuilder;
