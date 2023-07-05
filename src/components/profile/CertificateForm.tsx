import React, { useState } from "react";
import { Button, Card, TextField } from "@mui/material";
import CertificateDialog from "@/components/profile/CertificateDialog";
import { createPKCS10 } from "@/lib/pkcs10Generator";
import { Box } from "@mui/system";
import { styled } from "@mui/material/styles";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ICsr } from "@/interface/ICsr";
import { ICsrForm } from "@/interface/ICsrForm";
import { createCertificate } from "@/lib/fetchers/internalFetchers";
import { useSession } from "next-auth/react";
import { CertificateSignResponse } from "@/types/napcore/csr";
import Snackbar from "@/components/shared/feedback/Snackbar";
import Subheading from "@/components/shared/display/typography/Subheading";

const commonNamePrefix = process.env.NEXT_PUBLIC_INTERCHANGE_PREFIX;

export const CertificateForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ICsrForm>({
    defaultValues: {
      countryCode: "",
      orgName: "",
    },
  });
  const [csr, setCsr] = useState<ICsr>();
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [chain, setChain] = useState<CertificateSignResponse>();
  const { data: session } = useSession();

  const onSubmit: SubmitHandler<ICsrForm> = (data) => {
    createPKCS10({
      commonName: `${(commonNamePrefix as string) + session?.user?.email}`,
      country: data.countryCode.toUpperCase(),
      organization: data.orgName,
    })
      .then((csr) => {
        setCsr({ csr: csr.csr, privateKey: csr.privateKey });
        void postCsr(csr);
      })
      .catch(() => {
        setError(true);
      });
  };

  const postCsr = async (csr: ICsr) => {
    const response = await createCertificate(
      session?.user?.email as string,
      csr.csr
    );
    if (response.ok) {
      const json = await response.json();
      setChain(json);
      setOpen(true);
    } else {
      setError(true);
    }
  };

  const handleSnackClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setError(false);
  };

  const handleClickClose = (close: boolean) => {
    setOpen(close);
  };

  return (
    <StyledCard variant={"outlined"}>
      <Subheading>Certificate</Subheading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "center",
          }}
        >
          <Controller
            name="countryCode"
            control={control}
            rules={{ required: true, pattern: /^[a-z]{2}$/i }}
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                label="Country code *"
                error={Boolean(errors.countryCode)}
                helperText={
                  Boolean(errors.countryCode) &&
                  "Country code is required and a valid country code"
                }
              />
            )}
          />
          <Controller
            name="orgName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Organisation name *"
                error={Boolean(errors.orgName)}
                helperText={
                  Boolean(errors.orgName) && "Organisation name is required."
                }
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
        </Box>
      </form>
      <CertificateDialog
        privateKey={csr?.privateKey as string}
        chain={chain as CertificateSignResponse}
        handleDialog={handleClickClose}
        open={open}
      />
      <Snackbar
        message={"An error occured, try again!"}
        severity={"error"}
        open={error}
        handleClose={handleSnackClose}
      />
    </StyledCard>
  );
};

const StyledButton = styled(Button)(({}) => ({
  width: "200px",
  textTransform: "none",
  borderRadius: 100,
}));

const StyledCard = styled(Card)(({}) => ({
  padding: "16px",
  display: "flex",
  width: "500px",
  gap: "24px",
  flexDirection: "column",
}));
