import { Chip, FormHelperText, TextField, Typography } from "@mui/material";
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
import CancelIcon from '@mui/icons-material/Cancel';

const PrivateChannelsCreator = () => {
  const [feedback, setFeedback] = useState<IFeedback>({
    feedback: false,
    message: "",
    severity: "success",
  });
  const { data: session } = useSession();
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>(''); // Current input value

  const {
    handleSubmit,
    control,
    setValue,
    register,
    getValues,
    reset,
    formState: { errors }
  } = useForm<IFormPrivateChannelInput>({
    defaultValues: {
      peers: [],
      description: "",
    },
  });

  const addChip = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !getValues('peers').includes(trimmedValue)) {
      setValue('peers', [...getValues('peers'), trimmedValue], { shouldValidate: true });
      setInputValue('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',' || event.key === ' ') {
      event.preventDefault();
      addChip();
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (input.includes(',')) {
      const parts = input.split(',').map((part) => part.trim());
      const lastPart = parts.pop() || '';

      parts.forEach((part) => {
        if (part && !getValues('peers').includes(part)) {
          setValue('peers', [...getValues('peers'), part], { shouldValidate: true });
        }
      });

      setInputValue(lastPart);
    } else {
      setInputValue(input);
    }
  };

  const handleDeleteChip = (valueToDelete: string) => {
    setValue('peers', getValues('peers').filter((chip) => chip !== valueToDelete), { shouldValidate: true });
  };

  const clearForm = () => {
    reset({ peers: [] });
    setInputValue('');
  };

  const onSubmit: SubmitHandler<IFormPrivateChannelInput> = async ({ peers, ...rest }) => {
    const peersWithoutWhitespace = peers.map(item => item.trim()).filter(item => item !== '');

    const response = await createPrivateChannel(
      session?.user.commonName as string,
      { ...rest, peers: peersWithoutWhitespace }
    );

    setFeedback({
      feedback: true,
      message: response.ok
        ? "Private channel successfully created"
        : "Private channel could not be created, try again!",
      severity: response.ok ? "success" : "warning"
    });

    if (response.ok) {
      await router.push('/private-channels');
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
            <Box display="flex" alignItems="flex-start" p={1} borderRadius={1} border={1} flexWrap="wrap"
            sx={{borderColor: errors.peers ? 'red' : 'grey.300'}}>
              <Typography color="textSecondary" sx={{ marginRight: '8px' }}>Peers *</Typography>

              <Box display="flex" flexWrap="wrap" sx={{ gap: '8px', maxWidth: '100%' }}>
                {getValues('peers').map((value, index) => (
                  <Chip
                    key={index}
                    label={value}
                    onDelete={() => handleDeleteChip(value)}
                    sx={{
                      backgroundColor: "sidebarActiveColor",
                      border: "1px solid",
                      borderColor: "sidebarBorderColor",
                    }}
                    deleteIcon={<CancelIcon style={{ color: 'grey' }} />}
                    variant="outlined"
                  />
                ))}
              </Box>

              <Controller
                name="peers"
                control={control}
                rules={{
                  required: "At least one peer is required",
                }}
                render={({ field }) => (
                  <>
                    <TextField
                      {...field}
                      variant="standard"
                      placeholder="Add peers (comma, space, or enter to add)"
                      value={inputValue}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown}
                      multiline
                      minRows={1}
                      InputProps={{
                        disableUnderline: true,
                        style: {
                          minWidth: '200px',
                          marginLeft: '8px',
                          flexGrow: 1,
                        },
                      }}
                      sx={{
                        flexGrow: 1,
                        marginTop: '8px',
                        width: '100%',
                      }}
                    />
                    {errors.peers && (
                      <FormHelperText error>{errors.peers.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Box>

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
                    error={!!errors.description}
                    helperText={ errors.description ? errors.description.message : ""}
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
                onClick={clearForm}
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

export default PrivateChannelsCreator;
