import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import {
  AlertColor,
  Button,
  FormControl,
  FormHelperText,
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
  publicationId: string;
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
    getValues,
    getFieldState,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      messageType: [],
      causeCodes: [],
      protocolVersion: "",
      originatingCountry: [],
      publicationId: "",
      quadTree: [],
    },
  });

  /*
  Generate a new selector when the form state changes.
  Send the selector backwards via selectorCallback(selector) to find matching capabilities.
  */
  useEffect(() => {
    const watchAllFields = watch((value) => {
      const selector = generateSelector(value);
      selectorCallback(selector);
      console.log(selector);
      setSelector(selector);
    });
    return () => watchAllFields.unsubscribe();
  }, [watch]);

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

  const onSubmit: SubmitHandler<IFormInputs> = async () => {
    const name = "anna";
    const response = await createSubscription(name, selector);
    const data = await response.json();
    console.log(data);
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <StyledFormControl>
        <Controller
          name="publicationId"
          control={control}
          render={({ field }) => (
            <StyledTextField {...field} label="Publication ID" />
          )}
        />
        {/*https://stackoverflow.com/a/72688980*/}
        <Controller
          name="messageType"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <FormControl error={Boolean(errors.messageType)}>
              <InputLabel>Message type *</InputLabel>
              <StyledSelect {...field} multiple label="Message type *">
                {messageTypes.map((messageType, index) => (
                  <MenuItem key={index} value={messageType.value}>
                    {messageType.value}
                  </MenuItem>
                ))}
              </StyledSelect>
              {Boolean(errors.messageType) && (
                <FormHelperText>Message type is required</FormHelperText>
              )}
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
        {/*TODO: Only show if DENM*/}
        <Controller
          name="causeCodes"
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel>Cause codes</InputLabel>
              <StyledSelect
                MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                multiple
                label="Cause codes"
                {...field}
              >
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
        <StyledButton color="greenDark" variant="contained" type="submit">
          Save subscription
        </StyledButton>
      </StyledFormControl>
    </form>
  );
};

const StyledTextField = styled(TextField)(({}) => ({
  /*
  width: "344px",
*/
  "& .MuiInputBase-input": { background: "white" },
}));

const StyledSelect = styled(Select)(({}) => ({
  /*  width: "344px",*/
  background: "white",
}));

const StyledFormControl = styled(FormControl)(({}) => ({
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
