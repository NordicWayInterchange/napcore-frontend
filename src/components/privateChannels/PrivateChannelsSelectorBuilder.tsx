import { FormControl, FormHelperText, InputLabel, Select, TextField } from "@mui/material";
import React, {useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Box } from "@mui/system";
import Snackbar from "@/components/shared/feedback/Snackbar";
import { IFeedback } from "@/interface/IFeedback";
import { useSession } from "next-auth/react";
import { usePublicationIds } from "@/hooks/usePublicationIds";
import { useRouter } from "next/router";
import { StyledButton, StyledCard, StyledFormControl } from "@/components/shared/styles/StyledSelectorBuilder";
import { IFormPrivateChannelInput } from "@/interface/IFormPrivateChanelInput";

const PrivateChannelsSelectorBuilder = () => {
  const [duplicatePublicationIdError, setDuplicatePublicationIdError] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const { data: session } = useSession();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm<IFormPrivateChannelInput>({
    defaultValues: {
      peers: [],
      description: "",
    },
  });

  const onSubmit: SubmitHandler<IFormPrivateChannelInput> = async (data) => {
    /* Add POST private channel
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
    }*/
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    {...register('description', {
                      required: 'Description is required.'
                    })}
                    fullWidth
                    error={!!duplicatePublicationIdError || !!errors.description}
                    helperText={ errors.description ? errors.description.message : duplicatePublicationIdError}
                    label="Description *"
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Controller
                name="peers"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(errors.peers)}>
                    <InputLabel>Peers *</InputLabel>
                    <Select label="Originating country *" {...field}>

                    </Select>
                    {Boolean(errors.peers) && (
                      <FormHelperText>Peers is required</FormHelperText>
                    )}
                  </FormControl>
                )}
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
              <StyledButton
                color="buttonThemeColor"
                variant="contained"
                type="submit"
              >
                Create my capability
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
