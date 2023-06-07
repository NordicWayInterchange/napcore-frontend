import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import CertificateDialog from "@/components/profile/CertificateDialog";
import { createPKCS10 } from "@/lib/pkcs10Generator";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { SecondHeading } from "@/components/shared/display/heading/SecondHeading";
import { BodyHeading } from "@/components/shared/display/heading/BodyHeading";

interface IFormInputs {
  countryCode: string;
  orgName: string;
}

interface ICsr {
  csr: string;
  privateKey: string;
}

export const CertificateForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({
    defaultValues: {
      countryCode: "",
      orgName: "",
    },
  });
  const [csr, setCsr] = useState<ICsr>();
  const [open, setOpen] = useState<boolean>(false);

  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    createPKCS10({
      commonName: "Henrik",
      country: data.countryCode,
      organization: data.orgName,
    }).then((csr) => {
      // @ts-ignore
      setCsr({ csr: csr.csr, privateKey: csr.privateKey });
      setOpen(true);
    });
    console.log(data);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
  };

  return (
    <StyledBox>
      <SecondHeading heading={"Certificate"} />
      <BodyHeading
        heading={"Please fill in your details in order to create a certificate"}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledBox>
          <Controller
            name="countryCode"
            control={control}
            rules={{ required: true, pattern: /^[a-z]{2}$/i }}
            render={({ field }) => (
              <StyledTextField
                {...field}
                label="Country code"
                error={Boolean(errors.countryCode)}
                helperText={
                  Boolean(errors.countryCode) &&
                  "Must be filled in and contain a valid country code"
                }
              />
            )}
          />
          <Controller
            name="orgName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <StyledTextField
                {...field}
                label="Organisation name"
                error={Boolean(errors.orgName)}
                helperText={Boolean(errors.orgName) && "Must be filled in"}
              />
            )}
          />
          <StyledButton
            fullWidth
            color="greenDark"
            variant="contained"
            type="submit"
          >
            Generate certificate
          </StyledButton>
        </StyledBox>
      </form>
      <CertificateDialog
        privateKey={csr?.privateKey as string}
        handleDialog={handleClickClose}
        open={open}
      />
    </StyledBox>
  );
};

const StyledTextField = styled(TextField)(({}) => ({
  width: "344px",
  "& .MuiInputBase-input": { background: "white" },
}));

const StyledBox = styled(Box)(({}) => ({
  display: "flex",
  flexDirection: "column",
  gap: "24px",
}));

const StyledButton = styled(Button)(({}) => ({
  width: "200px",
  textTransform: "none",
}));
