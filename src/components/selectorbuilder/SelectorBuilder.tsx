import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import { AlertColor, Grid, SelectChangeEvent, Typography } from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import TextField from "../shared/TextField";
import Select from "../shared/Select";
import { generateSelector } from "@/lib/generateSelector";
import TextArea from "../shared/TextArea";
import { ButtonComponent } from "../shared";
import { denmCauseCodes } from "@/lib/denmCauseCodes";
import { createSubscription } from "@/lib/internalFetchers";
import MapDialog from "../leaflet/MapDialog";
import Alert from "../shared/Alert";

type Props = {
  name: string;
  version: string;
  extendedCapability?: ExtendedCapability;
  selectorCallback: (selector: string) => void;
};

interface IAlert {
  title: string;
  information: string;
  severity?: AlertColor;
}

interface ISelector {
  messageType: MessageTypes[];
  causeCodes: string[];
  protocolVersion: string;
  originatingCountry: string[];
  publisherId: string;
  quadTree: string[];
}

const defaultSelector: ISelector = {
  messageType: [],
  causeCodes: [],
  protocolVersion: "",
  originatingCountry: [],
  publisherId: "",
  quadTree: [],
};

const DENM = MessageTypes.DENM;

const SelectorBuilder = (props: Props) => {
  const { name, version, extendedCapability, selectorCallback } = props;
  const [selector, setSelector] = useState<string>("");
  const [formState, setFormState] = useState<ISelector>(defaultSelector);
  const [errors, setErrors] = useState({}); // TODO: Handle errors
  const [showCauseCode, setShowCauseCode] = useState<boolean>();
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [persistSelector, setPersistSelector] = useState<string>("");
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const [alert, setAlert] = useState<IAlert>();

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

    if (response.ok) {
      setAlert({
        title: "Subscription have been created",
        severity: "success",
        information: "This is meant to display an success message!",
      });
    } else {
      setAlert({
        title: data.errorCode,
        severity: "error",
        information: "This is meant to display an error message - Try again!",
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setFormState((prevData) => ({
      ...prevData,
      quadTree: predefinedQuadtree,
    }));
    setOpen(false);
  };

  const quadtreeCallback = (value: string[]) => {
    setPredefinedQuadtree(value);
  };

  return (
    // TODO: add form component
    // validate fields before submitting
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
          <TextField
            value={formState.causeCodes}
            label={"Cause Codes"}
            name={"causeCodes"}
            onChange={handleTextField}
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
        quadtreeCallback={quadtreeCallback}
      />
      {alert && (
        <Grid item xs={12}>
          <Alert
            title={alert.title}
            severity={alert.severity}
            information={alert.information}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default SelectorBuilder;
