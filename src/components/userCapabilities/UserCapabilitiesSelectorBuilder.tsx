import { MessageTypes } from "@/types/messageType";
import { Button, Card, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { createUserCapability } from "@/lib/fetchers/internalFetchers";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { styled } from "@mui/material/styles";
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

const QUADTREE_REGEX = /^[0-3]+(,[0-3]+)*$/i;

const UserCapabilitiesSelectorBuilder = () => {
  const [duplicatePublicationIdError, setDuplicatePublicationIdError] = useState('');
  const [predefinedQuadtree, setPredefinedQuadtree] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const { data: session } = useSession();
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
    data.publicationId = data.publisherId + ":" + data.publicationId;
    if (validateUniquePublicationId(data.publicationId)) return;

    const application = { "application": data };
    const metadata = { "metadata": {} }; //Mandatory field

    const response = await createUserCapability(
      session?.user.commonName as string,
      Object.assign({}, application, metadata)
    );

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Capability successfully created",
        severity: "success"
      });
      window.location.href = "/capabilities";
    } else {
      setFeedback({
        feedback: true,
        message: "Capability could not be created, try again!",
        severity: "warning"
      });
    }
  };

  const findPublicationIds = (value: any) => {
    return data?.some((id: any) => id === value);
  };

  const validateUniquePublicationId = (value: string) => {
    if (value && findPublicationIds(value)) {
      setDuplicatePublicationIdError("Publication ID and publisher ID combination must be unique, please try another one.");
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
                    label="Publisher Id *"
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
                        <MenuItem key={index} value={country.value}>
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
                        <MenuItem key={index} value={country.value}>
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
                      label="publisher name *"
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
                      label="publication type *"
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

                      if (value.length < 1) {
                        resetField("quadTree");
                      }
                    }}
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

export default UserCapabilitiesSelectorBuilder;
