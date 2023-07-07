import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from "@mui/material";
import { CertificateSignResponse } from "@/types/napcore/certificate";
import { useSession } from "next-auth/react";
import { handleDecoding, handleFile } from "@/lib/handleFile";
import { Box } from "@mui/system";

type Props = {
  privateKey: string;
  chain: CertificateSignResponse;
  open: boolean;
  handleDialog: (close: boolean) => void;
};

const commonNamePrefix = process.env.NEXT_PUBLIC_INTERCHANGE_PREFIX;

export default function CertificateDialog(props: Props) {
  const { privateKey, open, handleDialog, chain } = props;
  const { data: session } = useSession();

  const handleClose = () => {
    handleDialog(false);
  };

  const downloadButtons = [
    {
      text: "Download private key",
      onClick: () => handleFile(privateKey, "privateKey.txt"),
    },
    {
      text: "Download chain certificate",
      onClick: () =>
        handleFile(
          handleDecoding(chain.chain),
          `chain.${
            ((commonNamePrefix as string) + session?.user?.email) as string
          }.txt`
        ),
    },
    {
      text: "Download root certificate",
      onClick: () =>
        handleFile(handleDecoding(chain.chain.at(-1) as string), "root.txt"),
    },
  ];

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Certificate was successfully created</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginY: 1 }}>
            Please download your private key, chain certificate and root
            certificate before closing this window.
          </DialogContentText>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="text"
              color="greenDark"
              sx={{ borderRadius: 100, textTransform: "none", width: 300 }}
              onClick={() =>
                /*handleFile(privateKey, "privateKey.key.pem"*/
                handleFile(privateKey, "privateKey.txt")
              }
              disableElevation
            >
              Download private key
            </Button>
            <Button
              variant="text"
              color="greenDark"
              sx={{ borderRadius: 100, textTransform: "none", width: 300 }}
              onClick={() =>
                /*handleFile(
                  chain,
                  `chain.${
                    ((commonNamePrefix as string) +
                      session?.user?.email) as string
                  }.crt.pem`
                )*/
                handleFile(
                  handleDecoding(chain.chain),
                  `chain.${
                    ((commonNamePrefix as string) +
                      session?.user?.email) as string
                  }.txt`
                )
              }
              disableElevation
            >
              Download chain certificate
            </Button>
            <Button
              variant="text"
              color="greenDark"
              sx={{ borderRadius: 100, textTransform: "none", width: 300 }}
              onClick={() =>
                /*handleFile(chain.certificates.at(-1), "root.crt.pem")*/
                handleFile(
                  handleDecoding(chain.chain.at(-1) as string),
                  "root.txt"
                )
              }
              disableElevation
            >
              Download root certificate
            </Button>
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            variant="text"
            color="greenDark"
            sx={{ borderRadius: 100, textTransform: "none" }}
            onClick={handleClose}
            disableElevation
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
