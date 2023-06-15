import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "../shared/input/TextField";
import { generateSelector } from "@/lib/generateSelector";
import TextArea from "../shared/input/TextArea";
import { createSubscription } from "@/lib/internalFetchers";
import MapDialog from "../map/MapDialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SecondHeading } from "@/components/shared/display/heading/SecondHeading";
import { BodyHeading } from "@/components/shared/display/heading/BodyHeading";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { messageTypes } from "@/lib/messageTypes";
import { originatingCountries } from "@/lib/originatingCountries";
import { causeCodes } from "@/lib/causeCodes";
import ClearIcon from "@mui/icons-material/Clear";

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
    setValue,
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

  const watchMessageType = watch("messageType");
  const DENM = MessageTypes.DENM;

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
  Remove cause codes from form, if the message type DENM is removed.
  */
  useEffect(() => {
    if (!watchMessageType.includes(DENM)) setValue("causeCodes", []);
  }, [watchMessageType]);

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

    // todo: no matching capabilites
    console.log(data);
  };

  const handleClose = () => {
    setValue("quadTree", predefinedQuadtree);
    setOpen(false);
  };

  const quadtreeCallback = (value: string[]) => {
    setPredefinedQuadtree(value);
  };

  return (
    <>
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
          {watchMessageType.includes(DENM) && (
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
          )}
          {/*TODO: dont allow to start or end with comma*/}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Controller
              name="quadTree"
              control={control}
              rules={{ required: false, pattern: /^[-,0-9 ]+$/i }}
              render={({ field }) => (
                <StyledTextField
                  {...field}
                  label="Quadtree"
                  disabled
                  error={Boolean(errors.quadTree)}
                  sx={{ marginRight: 1 }}
                  /*InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => setValue("quadTree", [])}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    ),
                  }}*/
                  helperText={
                    Boolean(errors.quadTree) &&
                    "Only numbers and comma (,) is allowed"
                  }
                />
              )}
            />
            <StyledButton
              color="greenDark"
              variant="outlined"
              onClick={() => setOpen(true)}
            >
              Map
            </StyledButton>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <StyledButton
              color={advancedMode ? "error" : "success"}
              variant="outlined"
              onClick={handleAdvancedMode}
            >
              {advancedMode ? "Normal" : "Advanced"}
            </StyledButton>
            {/*            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Label"
            />*/}
            <StyledButton color="greenDark" variant="contained" type="submit">
              Save subscription
            </StyledButton>
          </Box>
        </StyledFormControl>
      </form>
      <MapDialog
        open={open}
        onClose={handleClose}
        quadtree={getValues("quadTree")}
        quadtreeCallback={quadtreeCallback}
      />
    </>
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
