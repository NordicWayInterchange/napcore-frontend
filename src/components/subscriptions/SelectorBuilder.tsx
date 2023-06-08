import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import {
  AlertColor,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { ChangeEvent, useEffect, useState } from "react";
import TextField from "../shared/input/TextField";
import { generateSelector } from "@/lib/generateSelector";
import TextArea from "../shared/input/TextArea";
import { ButtonComponent } from "../shared";
import { createSubscription } from "@/lib/internalFetchers";
import MapDialog from "../map/MapDialog";
import Alert from "../shared/feedback/Alert";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SecondHeading } from "@/components/shared/display/heading/SecondHeading";
import { BodyHeading } from "@/components/shared/display/heading/BodyHeading";
import CertificateDialog from "@/components/profile/CertificateDialog";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { messageTypes } from "@/lib/messageTypes";
import { originatingCountries } from "@/lib/originatingCountries";
import { causeCodes } from "@/lib/causeCodes";

type Props = {
  name: string;
  version: string;
  extendedCapability?: ExtendedCapability;
  selectorCallback: (selector: string) => void;
};

interface IFormInputs {
  messageType: string[];
  causeCodes: string[];
  protocolVersion: string;
  originatingCountry: string[];
  publisherId: string;
  quadTree: string[];
  selector: string;
}

const DENM = MessageTypes.DENM;

const SelectorBuilder = (props: Props) => {
  const { name, selectorCallback } = props;
  const [selector, setSelector] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [persistSelector, setPersistSelector] = useState<string>("");
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      messageType: [],
      causeCodes: [],
      protocolVersion: "",
      originatingCountry: [],
      publisherId: "",
      quadTree: [],
      selector: "",
    },
  });

  /*
  Generate a new selector when the form state changes.
  Send the selector backwards via selectorCallback(selector) to find matching capabilities.
  */
  /*  useEffect(() => {
    const selector = generateSelector(formState);
    setSelector(selector);
    selectorCallback(selector);
  }, [formState]);*/

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

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {};

  const saveSubscription = async (name: string, selector: string) => {
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);

    /*    if (response.ok) {
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
    }*/
  };

  /*  const handleClose = () => {
    setFormState((prevData) => ({
      ...prevData,
      quadTree: predefinedQuadtree,
    }));
    setOpen(false);
  };*/

  const quadtreeCallback = (value: string[]) => {
    setPredefinedQuadtree(value);
  };

  return (
    <StyledBox>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledBox>
          {/*https://stackoverflow.com/a/72688980*/}
          <Controller
            name="messageType"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel>Message type</InputLabel>
                <StyledSelect multiple label="Message type" {...field}>
                  {messageTypes.map((messageType, index) => (
                    <MenuItem key={index} value={messageType.value}>
                      {messageType.value}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            )}
          />
          <Controller
            name="originatingCountry"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel>Originating country</InputLabel>
                <StyledSelect multiple label="Originating country" {...field}>
                  {originatingCountries.map((country, index) => (
                    <MenuItem key={index} value={country.value}>
                      {country.value}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            )}
          />
          <Controller
            name="causeCodes"
            control={control}
            render={({ field }) => (
              <FormControl>
                <InputLabel>Cause codes</InputLabel>
                <StyledSelect multiple label="Cause codes" {...field}>
                  {causeCodes.map((country, index) => (
                    <MenuItem key={index} value={country.value}>
                      {country.value}: {country.label}
                    </MenuItem>
                  ))}
                </StyledSelect>
              </FormControl>
            )}
          />
          {/*TODO: dont allow to start or end with comma*/}
          <Controller
            name="quadTree"
            control={control}
            rules={{ required: false, pattern: /^[-,0-9 ]+$/i }}
            render={({ field }) => (
              <StyledTextField
                {...field}
                label="Quadtree"
                error={Boolean(errors.quadTree)}
                helperText={
                  Boolean(errors.quadTree) &&
                  "Only numbers and comma (,) is allowed"
                }
              />
            )}
          />
          <StyledButton
            fullWidth
            color="greenDark"
            variant="contained"
            type="submit"
          >
            Save subscription
          </StyledButton>
        </StyledBox>
      </form>
    </StyledBox>
  );
};

const StyledTextField = styled(TextField)(({}) => ({
  width: "344px",
  "& .MuiInputBase-input": { background: "white" },
}));

const StyledSelect = styled(Select)(({}) => ({
  width: "344px",
  background: "white",
}));

const StyledBox = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
}));

const StyledButton = styled(Button)(({}) => ({
  width: "200px",
  textTransform: "none",
  borderRadius: 100,
}));

export default SelectorBuilder;
