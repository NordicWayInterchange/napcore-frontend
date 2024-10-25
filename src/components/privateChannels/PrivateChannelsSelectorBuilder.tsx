import { TextField } from "@mui/material";
import React, {useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { StyledButton, StyledCard, StyledFormControl } from "@/components/shared/styles/StyledSelectorBuilder";
import { IFormPrivateChannelInput } from "@/interface/IFormPrivateChanelInput";
import { createPrivateChannel } from "@/lib/fetchers/internalFetchers";

const PrivateChannelsSelectorBuilder = () => {
  const [duplicatePublicationIdError, setDuplicatePublicationIdError] = useState('');
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const [predefinedPeers, setPredefinedPeers] = useState<string[]>([]);

  const { data: session } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    register,
    clearErrors,
    resetField,
    reset,
    formState: { errors },
  } = useForm<IFormPrivateChannelInput>({
    defaultValues: {
      peers: [],
      description: "",
    },
  });

  const onSubmit: SubmitHandler<IFormPrivateChannelInput> = async (data) => {
    console.log('data', data);
    const response = await createPrivateChannel(
      session?.user.commonName as string,
      Object.assign({}, data)
    );

    if (response.ok) {
      setFeedback({
        feedback: true,
        message: "Private channel successfully created",
        severity: "success"
      });
      await router.push('/private-channels');
    } else {
      setFeedback({
        feedback: true,
        message: "Private channel could not be created, try again!",
        severity: "warning"
      });
    }
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

  return (
    <>
      <StyledCard variant={"outlined"}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledFormControl>
            <Controller
              name="peers"
              control={control}
              rules={{
                required: "Peers is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Peers *"
                  fullWidth
                  onChange={(event) => {
                    const value = event.target.value;

                    clearErrors("peers");


                    setValue("peers", value.split(","));
                    setPredefinedPeers(value.split(","));

                    if (value.trim().length < 1) {
                      resetField("peers");
                    }
                  }}
                  error={Boolean(errors.peers)}
                  sx={{ marginRight: 1 }}
                  helperText={errors.peers ? errors.peers.message : ""}
                />
              )}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('description', {
                      required: 'Description is required'
                    })}
                    fullWidth
                    multiline
                    rows={5}
                    label="Description *"
                    error={!!duplicatePublicationIdError || !!errors.description}
                    helperText={ errors.description ? errors.description.message : duplicatePublicationIdError}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <StyledButton
                color="buttonThemeColor"
                variant="contained"
                type="submit"
              >
                Create private channel
              </StyledButton>
              <StyledButton
                color="buttonThemeColor"
                variant="outlined"
                onClick={() => reset()}
              >
                Clear form
              </StyledButton>
            </Box>
          </StyledFormControl>
        </form>
      </StyledCard>
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

export default PrivateChannelsSelectorBuilder;
