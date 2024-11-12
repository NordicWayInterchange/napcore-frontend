import { MessageTypes } from "@/types/messageType";
import {

  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { createUserCapability } from "@/lib/fetchers/internalFetchers";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import { messageTypes } from "@/lib/data/messageTypes";
import { originatingCountries } from "@/lib/data/originatingCountries";
import { causeCodes } from "@/lib/data/causeCodes";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import MapDialog from "@/components/map/MapDialog";
import { IFormCapabilityInputs } from "@/interface/IFormCapabilityInputs";
import { usePublicationIds } from "@/hooks/usePublicationIds";
import { useRouter } from "next/router";
import { handleQuadtree } from "@/lib/handleQuadtree";
import { menuItemStyles, StyledButton, StyledCard, StyledFormControl } from "@/components/shared/styles/StyledSelectorBuilder";

const QUADTREE_REGEX = /^[0-3]+(,[0-3]+)*$/i;

const UserCapabilitiesCreator = () => {
  const [duplicatePublicationIdError, setDuplicatePublicationIdError] = useState('');
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [publisherIdInput, setPublisherIdInput] = useState("");
  const [publicationIdInput, setPublicationIdInput] = useState("");
  const [showAdornment, setShowAdornment] = useState(false);

  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const { data: session } = useSession();
  const router = useRouter();

  const { data } = usePublicationIds(
    session?.user.commonName as string,
  );

  const {
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    setError,
    register,
    getFieldState,
    clearErrors,
    resetField,
    reset,
    formState: { errors },
  } = useForm<IFormCapabilityInputs>({
    defaultValues: {
      messageType: "",
      causeCode: [],
      protocolVersion: "",
      publisherName: "",
      publicationType: "",
      originatingCountry: "",
      publicationId: "",
      publisherId: "",
      quadTree: [],
    },
  });

  const watchMessageType = watch("messageType");
  const DENM = MessageTypes.DENM;
  const DATEX_2 = MessageTypes.DATEX_2;

  /*
  Remove cause codes from form, if the message type DENM is removed.
  */
  useEffect(() => {
    if (!watchMessageType.includes(DENM)) {
      setValue("causeCode", []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchMessageType]);

  const onSubmit: SubmitHandler<IFormCapabilityInputs> = async (data) => {
    data.publicationId = `${data.publisherId}:${data.publicationId}`;

    if (validateUniquePublicationId(data.publicationId)) return;

    const payload = {
      application: data,
      metadata: {}  // Mandatory field
    };

    const response = await createUserCapability(
      session?.user.commonName as string,
      payload
    );

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Capability successfully created",
        severity: "success",
      });
      await router.push('/capabilities');
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Capability could not be created, try again!";

      setFeedback({
        feedback: true,
        message: errorMessage,
        severity: "warning",
      });
    }
  };

  const findPublicationIds = (value: any) => {
    return data?.some((id: any) => id === value);
  };

  const validateUniquePublicationId = (value: string) => {
    if (value && findPublicationIds(value)) {
      setDuplicatePublicationIdError("Publisher ID and publication ID combination must be unique, please try another one.");
      return true;
    } else {
      setDuplicatePublicationIdError("");
    }
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

  const handleTextChange = (event:any) => {
    const userInput = event.target.value;
    setValue("publisherId", userInput);
    setPublisherIdInput(userInput);
    if (validateUniquePublicationId(userInput + ":" + publicationIdInput)) return;
    if (userInput !== '') {
      setShowAdornment(true);
    }
  };

  return (
    <>
      <StyledCard variant={"outlined"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormControl>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="publisherId"
                control={control}
                rules={{ required: 'Publisher ID is required.' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.publisherId}
                    helperText={errors.publisherId ? errors.publisherId.message : ''}
                    label="Publisher ID *"
                    onChange={(e) => {
                      field.onChange(e);
                      handleTextChange(e);
                    }}
                  />
                )}
              />
              <Controller
                name="publicationId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('publicationId', {
                      required: 'Publication ID is required.'
                    })}
                    fullWidth
                    error={!!duplicatePublicationIdError || !!errors.publicationId}
                    helperText={ errors.publicationId ? errors.publicationId.message : duplicatePublicationIdError}
                    label="Publication ID *"
                    onBlur={(event) => {
                      const userInput = event.target.value;
                      setPublicationIdInput(userInput);
                      if (validateUniquePublicationId(publisherIdInput + ":" + userInput)) return;
                    }
                    }
                    InputProps={{
                      startAdornment: showAdornment && (
                        <InputAdornment position="start">
                          {publisherIdInput ? publisherIdInput + ":" : ""}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="protocolVersion"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.protocolVersion}
                    helperText={errors.protocolVersion ? "Protocol version is required." : ''}
                    label="Protocol version *"
                  />
                )}
              />
              <Controller
                name="originatingCountry"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors.originatingCountry)}>
                    <InputLabel>Originating country *</InputLabel>
                    <Select label="Originating country *" {...field}>
                      {originatingCountries.map((country, index) => (
                        <MenuItem key={index} value={country.value} sx={menuItemStyles}>
                          {country.value}
                        </MenuItem>
                      ))}
                    </Select>
                    {Boolean(errors.originatingCountry) && (
                      <FormHelperText>Originating country is required</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="messageType"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors.messageType)}
                  >
                    <InputLabel>Message type *</InputLabel>
                    <Select {...field} label="Message type *">
                      {messageTypes.map((messageType, index) => (
                        <MenuItem key={index} value={messageType.value} sx={menuItemStyles}>
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
              {watchMessageType.includes(DENM) && (
              <Controller
                name="causeCode"
                control={control}
                rules={{ required: true}}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={!!errors.causeCode}
                    disabled={!watchMessageType.includes(DENM)}
                  >
                    <InputLabel>Cause codes *</InputLabel>
                    <Select
                      MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                      multiple
                      label="Cause codes *"
                      {...field}
                    >
                      {causeCodes.map((country, index) => (
                        <MenuItem key={index} value={country.value} sx={menuItemStyles}>
                          {country.value}: {country.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.causeCode && <FormHelperText>Cause code is required.</FormHelperText>}
                  </FormControl>
                )}
              />
              )}
            {watchMessageType.includes(DATEX_2) && (
                        <Controller
                          name="publisherName"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.publisherName}
                              helperText={errors.publisherName ? "Publisher name is required." : ""}
                              label="Publisher name *"
                            />
                          )}
                        />
                      )}
                      {watchMessageType.includes(DATEX_2) && (
                        <Controller
                          name="publicationType"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              error={!!errors.publicationType}
                              helperText={errors.publicationType ? "publication type is required." : ""}
                              label="Publication type *"
                    />
                )}
              />
            )}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Controller
                name="quadTree"
                control={control}
                rules={{ required: true, pattern: QUADTREE_REGEX }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quadtree *"
                    fullWidth
                    onChange={handleQuadtree(setError, setValue, clearErrors, setPredefinedQuadtree, resetField)}
                    error={Boolean(errors.quadTree)}
                    sx={{ marginRight: 1 }}
                    helperText={
                      "Only comma (,) separated numbers between 0-3 is allowed."
                    }
                  />
                )}
              />
              <StyledButton
                color="buttonThemeColor"
                variant="outlined"
                disabled={!!getFieldState("quadTree").error}
                onClick={() => setOpen(true)}
              >
                Show map
              </StyledButton>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <StyledButton
                color="buttonThemeColor"
                variant="contained"
                type="submit"
                disabled={!!getFieldState("quadTree").error}
              >
                Create my capability
              </StyledButton>
              <StyledButton
                color="buttonThemeColor"
                variant="outlined"
                onClick={() => {reset(); setShowAdornment(false); setDuplicatePublicationIdError('');}}
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
    </>
  );
};

export default UserCapabilitiesCreator;
