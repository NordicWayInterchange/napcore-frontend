import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import {
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { generateSelector } from "@/lib/generateSelector";
import { createSubscription } from "@/lib/fetchers/internalFetchers";
import MapDialog from "../map/MapDialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import { messageTypes } from "@/lib/data/messageTypes";
import { originatingCountries } from "@/lib/data/originatingCountries";
import { causeCodes } from "@/lib/data/causeCodes";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { IFormInputs } from "@/interface/IFormInputs";
import { useSession } from "next-auth/react";

type Props = {
  matchingCapabilities: ExtendedCapability[] | [];
  selectorCallback: (selector: string) => void;
};

const MATCHING_CAP_LIMIT = 1;
const QUADTREE_REGEX = /^[0-3]+(,[0-3]+)*$/i;

const SelectorBuilder = (props: Props) => {
  const { selectorCallback, matchingCapabilities } = props;
  const [selector, setSelector] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [persistSelector, setPersistSelector] = useState<string>("");
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const { data: session } = useSession();

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    setError,
    getFieldState,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      messageType: [],
      causeCode: [],
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
      setSelector(selector);
    });
    return () => watchAllFields.unsubscribe();
  }, [watch]);

  /*
  Remove cause codes from form, if the message type DENM is removed.
  */
  useEffect(() => {
    if (!watchMessageType.includes(DENM)) setValue("causeCode", []);
  }, [watchMessageType]);

  const onSubmit: SubmitHandler<IFormInputs> = async () => {
    if (matchingCapabilities.length < MATCHING_CAP_LIMIT) {
      setFeedback({
        feedback: true,
        message: "You have no matching capabilities",
        severity: "info",
      });

      return;
    }

    const response = await createSubscription(
      session?.user?.email as string,
      selector
    );

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Subscription successfully created",
        severity: "success",
      });
    } else {
      setFeedback({
        feedback: true,
        message: "Subscription could not be created, try again!",
        severity: "warning",
      });
    }
  };

  const handleVerify = () => {
    selectorCallback(selector);
  };

  const handleTextArea = (event: any) => {
    const value = event.target.value;
    setSelector(value);
  };

  const handleClose = () => {
    setValue("quadTree", predefinedQuadtree);
    setOpen(false);
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setFeedback({ feedback: false, message: "", severity: "success" });
  };

  const quadtreeCallback = (value: string[]) => {
    setPredefinedQuadtree(value);
  };

  /*
  Switching to advanced mode will persist the selector.
  When turning off advanced mode, the selector will be set to the persisted value.
  */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdvancedMode(event.target.checked);
    if (!advancedMode) {
      setPersistSelector(selector);
    } else {
      setSelector(persistSelector);
    }
  };

  if (watch("quadTree")) {
    console.log(getValues("quadTree"));
  }

  return (
    <>
      <StyledCard variant={"outlined"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormControl>
            <Typography>
              Create a subscription with the form, or specify your own selector
              in advanced mode.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="publicationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    disabled={advancedMode}
                    fullWidth
                    label="Publication ID"
                  />
                )}
              />
              <Controller
                name="originatingCountry"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth disabled={advancedMode}>
                    <InputLabel>Originating country</InputLabel>
                    <Select multiple label="Originating country" {...field}>
                      {originatingCountries.map((country, index) => (
                        <MenuItem key={index} value={country.value}>
                          {country.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="messageType"
                control={control}
                rules={{ required: !advancedMode }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    disabled={advancedMode}
                    error={Boolean(errors.messageType)}
                  >
                    <InputLabel>Message type *</InputLabel>
                    <Select {...field} multiple label="Message type *">
                      {messageTypes.map((messageType, index) => (
                        <MenuItem key={index} value={messageType.value}>
                          {messageType.value}
                        </MenuItem>
                      ))}
                    </Select>
                    {Boolean(errors.messageType) && (
                      <FormHelperText>Message type is required</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              <Controller
                name="causeCode"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    disabled={!watchMessageType.includes(DENM) || advancedMode}
                  >
                    <InputLabel>Cause codes</InputLabel>
                    <Select
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
                    </Select>
                    {!watchMessageType.includes(DENM) && (
                      <FormHelperText>Enable with DENM</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Controller
                name="quadTree"
                control={control}
                rules={{ required: false, pattern: QUADTREE_REGEX }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quadtree"
                    fullWidth
                    onChange={(event) => {
                      const value = event.target.value;

                      if (!QUADTREE_REGEX.test(value)) {
                        setError("quadTree", { type: "pattern" });
                        setValue("quadTree", value.split(","));
                      } else {
                        setValue("quadTree", value.split(","));
                        clearErrors("quadTree");
                      }

                      setPredefinedQuadtree(value.split(","));
                    }}
                    disabled={advancedMode}
                    error={Boolean(errors.quadTree)}
                    sx={{ marginRight: 1 }}
                    helperText={
                      "Only comma (,) separated numbers between 0-3 is allowed"
                    }
                  />
                )}
              />
              <StyledButton
                color="greenDark"
                variant="text"
                disabled={!!getFieldState("quadTree").error}
                onClick={() => setOpen(true)}
              >
                Map
              </StyledButton>
            </Box>
            <FormControlLabel
              control={<Switch onChange={handleChange} />}
              label="Advanced mode (will disable form)"
            />
            {advancedMode && (
              <>
                <Divider />{" "}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <TextField
                    multiline
                    rows={4}
                    value={selector}
                    fullWidth
                    label="Selector"
                    sx={{ marginRight: 1 }}
                    onChange={handleTextArea}
                  />
                  <StyledButton
                    color="greenDark"
                    variant="text"
                    onClick={handleVerify}
                  >
                    Verify
                  </StyledButton>
                </Box>
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <StyledButton
                color="greenDark"
                variant="contained"
                type="submit"
                disabled={!!getFieldState("quadTree").error}
              >
                Save subscription
              </StyledButton>
            </Box>
          </StyledFormControl>
        </form>
      </StyledCard>
      <MapDialog
        open={open}
        onClose={handleClose}
        quadtree={getValues("quadTree")}
        quadtreeCallback={quadtreeCallback}
      />
      {feedback.feedback && (
        <Snackbar
          message={feedback.message}
          severity={feedback.severity}
          open={feedback.feedback}
          handleClose={handleSnackClose}
        />
      )}
    </>
  );
};

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

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  width: "100%",
}));

export default SelectorBuilder;
