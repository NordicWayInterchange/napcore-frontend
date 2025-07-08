import { ExtendedCapability } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { generateSelector } from "@/lib/generateSelector";
import {
  createDelivery
} from "@/lib/fetchers/internalFetchers";
import MapDialog from "../../map/MapDialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import { messageTypes } from "@/lib/data/messageTypes";
import { originatingCountries } from "@/lib/data/originatingCountries";
import { causeCodes } from "@/lib/data/causeCodes";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { IFormInputs } from "@/interface/IFormInputs";
import { useSession } from "next-auth/react";
import { ExtendedDelivery } from "@/types/delivery";
import { useRouter } from "next/router";
import { handleQuadtree } from "@/lib/handleQuadtree";
import { StyledButton, StyledCard, StyledFormControl,menuItemStyles } from "@/components/shared/styles/StyledSelectorBuilder";
import { handleDescription } from "@/lib/handleDescription";
import ConfirmSubDialog from "@/components/shared/actions/ConfirmSubDialog";
import { HandleCreateSubscription } from "@/components/shared/utils/HandleCreateSubscription";
import { router } from "next/client";

type Props = {
  matchingElements: ExtendedCapability[] | ExtendedDelivery[] | [];
  selectorCallback: (selector: string) => void;
  label: string;
  publicationIdRow: string;
  dialogMessage: boolean;
  subscriptionConfirmationText: string;
};

const MATCHING_CAP_LIMIT = 1;
const QUADTREE_REGEX = /^[0-3]+(,[0-3]+)*$/i;


const SelectorBuilder = (props: Props) => {
  const { selectorCallback, matchingElements, label, publicationIdRow, dialogMessage, subscriptionConfirmationText } = props;
  const [selector, setSelector] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState(false);
  const [description, setDescription] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [persistSelector, setPersistSelector] = useState<string>("");
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [selectedPublicationId, setSelectedPublicationId] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [displayDialogMessage, setDisplayDialogMessage] = useState<boolean>(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleClickClose = (close: boolean) => {
    setDialogOpen(close);
  }

  const handleMoreClose = () => {
    setDrawerOpen(true);
  };

  /*async function createArtifacts(artifactType: string, name: string, bodyData: Object) {
    console.log('dialogMessage', dialogMessage);
    return artifactType === "Delivery"
      ? createDelivery(name, bodyData)
      : (() => {
        if (dialogMessage) {
          setDisplayDialogMessage(true);
          return;
        }
        setDisplayDialogMessage(false);
        return createSubscription(name, bodyData);
      })();
  }*/
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    setError,
    getFieldState,
    clearErrors,
    register,
    resetField,
    reset,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      messageType: [],
      causeCode: [],
      protocolVersion: "",
      publisherName: "",
      publicationType: "",
      originatingCountry: [],
      publicationId: "",
      quadTree: [],
      description: "",
    },
  });

  const watchMessageType = watch("messageType");
  const DENM = MessageTypes.DENM;
  const DATEX_2 = MessageTypes.DATEX_2;
  console.log('subscriptionConfirmationText', subscriptionConfirmationText);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  /*
  Remove cause codes from form, if the message type DENM is removed.
  */
  useEffect(() => {
    if (!watchMessageType.includes(DENM)) setValue("causeCode", []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchMessageType]);

  useEffect(() => {
    reset();
    setSelectedPublicationId(publicationIdRow);
    setValue("publicationId", publicationIdRow, { shouldValidate: true });
  }, [publicationIdRow, setValue, reset ]);


  const onSubmit: SubmitHandler<IFormInputs> = async () => {
    setDialogOpen(true);
    if (matchingElements.length < MATCHING_CAP_LIMIT) {
      setFeedback({
        feedback: true,
        message: "You have no matching capabilities",
        severity: "info",
      });

      return;
    }

    const bodyData = {
      selector: selector,
      description: description
    };

    if (label == "Delivery") {
      const response = await createDelivery( session?.user.commonName as string, bodyData);
      if (response.ok) {
        setFeedback({
          feedback: true,
          message: `${label} successfully created`,
          severity: "success"
        });
        await router.push('/deliveries');
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || `${label} could not be created, try again!`;

        setFeedback({
          feedback: true,
          message: errorMessage,
          severity: "warning"
        })
      }
    } else {
      console.log('dialogMessage', dialogMessage);

      if (dialogMessage) {
        console.log('HERE');
        //setDisplayDialogMessage(true);
        return;
      }
      //setDisplayDialogMessage(false);
      //await HandleCreateSubscription(session?.user.commonName as string, setFeedback, selector, description, "selectorBuilder");
      //await router.push('/subscriptions');
      handleMoreClose();
    }

    /*const response = await createArtifacts(
      label,
      session?.user.commonName as string,
      bodyData
    );

    if (response?.ok) {
      setFeedback({
        feedback: true,
        message: `${label} successfully created`,
        severity: "success"
      });
      await router.push(label === "Delivery" ? '/deliveries' : '/subscriptions');
    } else {
      const errorData = await response?.json();
      const errorMessage = errorData?.message || `${label} could not be created, try again!`;

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning"
      });
    }*/
  };
  const handleReset = () => {
    reset();
    setSelectedPublicationId('');
    setDescription('');
    setDescriptionError(false);
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

  const handleSnackClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
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

  return (
    <>
      <StyledCard variant={"outlined"} sx={{boxShadow: 2}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormControl>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="publicationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={selectedPublicationId}
                    {...register("publicationId")}
                    onChange={(e) => {
                      const userInput = e.target.value;
                      field.onChange(userInput);
                      setSelectedPublicationId(userInput);
                     }
                    }
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
                        <MenuItem key={index} value={country.value} sx={menuItemStyles}>
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
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    disabled={advancedMode}
                  >
                    <InputLabel>Message type</InputLabel>
                    <Select {...field} multiple label="Message type">
                      {messageTypes.map((messageType, index) => (
                        <MenuItem key={index} value={messageType.value} sx={menuItemStyles}>
                          {messageType.value}
                        </MenuItem>
                      ))}
                    </Select>
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
                        <MenuItem key={index} value={country.value} sx={menuItemStyles}>
                          {country.value}{country.label ? ':' : ''} {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {!watchMessageType.includes(DENM) && (
                      <FormHelperText>Enable with DENM</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
              {watchMessageType.includes(DATEX_2) && (
                <Controller
                  name="publisherName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled={advancedMode}
                      label="publisher name"
                    />
                  )}
                />
              )}
              {watchMessageType.includes(DATEX_2) && (
                <Controller
                  name="publicationType"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      disabled={advancedMode}
                      label="publication type"
                    />
                  )}
                />
              )}
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
                    onChange={handleQuadtree(setError, setValue, clearErrors, setPredefinedQuadtree, resetField)}
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
                sx={{mt:-1}}
                color="buttonThemeColor"
                variant="outlined"
                disabled={!!getFieldState("quadTree").error || advancedMode}
                onClick={() => setOpen(true)}
              >
                Show map
              </StyledButton>
            </Box>
            <Box>
              <TextField
                name="description"
                multiline
                rows={4}
                value={description}
                label="Description"
                onChange={(event) =>
                  handleDescription(event, setDescription, setDescriptionError)}
                error={descriptionError}
                helperText={descriptionError ? "Description exceeds maximum length of 255 characters" : ""}
                fullWidth
              />
            </Box>
            <FormControlLabel
              control={<Switch onChange={handleChange} />}
              label="Advanced mode (disables all fields except description)"
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
                    color="buttonThemeColor"
                    variant="outlined"
                    onClick={handleVerify}
                  >
                    Verify
                  </StyledButton>
                </Box>
              </>
            )}
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <StyledButton
                color="buttonThemeColor"
                variant="contained"
                type="submit"
                disabled={!!getFieldState("quadTree").error}
              >
                Save {label}
              </StyledButton>
              <StyledButton
                color="buttonThemeColor"
                variant="outlined"
                onClick={handleReset}
              >
                Clear form
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
      {dialogMessage && (
        <ConfirmSubDialog
          open={dialogOpen}
          actorCommonName={session?.user.commonName as string}
          handleMoreClose={handleMoreClose}
          handleDialog={handleClickClose}
          selector={selector}
          description={description}
          text= {subscriptionConfirmationText}
        />
      )}
    </>
  );
};

export default SelectorBuilder;