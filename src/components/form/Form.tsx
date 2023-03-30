import { Capability, RedirectStatus } from "@/types/capability";
import { MessageTypes } from "@/types/messageType";
import { OriginatingCountry } from "@/types/originatingCountry";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { getEnumValues } from "../../lib/getEnumValues";
import InputComponent from "./InputComponent";
import SelectComponent from "./SelectComponent";

type Props = {
  name: string;
  version: string;
  capability: Capability;
};

const Form = ({
  version,
  name,
  capability = {
    messageType: "",
    publisherId: "",
    originatingCountry: "",
    protocolVersion: "",
    quadTree: [],
    redirect: RedirectStatus.MANDATORY,
    shardCount: 1,
    infoUrl: "",
  },
}: Props) => {
  const [subscriptionData, setSubscriptionData] = useState(capability);
  const [errors, setErrors] = useState({});

  const { messageType, protocolVersion, originatingCountry, publisherId } =
    subscriptionData;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target;
    setSubscriptionData((prevData) => ({ ...prevData, [name]: value }));
  };

  console.log(subscriptionData);

  return (
    <Box sx={{ minWidth: 120 }}>
      <SelectComponent
        value={messageType}
        onChange={handleChange}
        label={"Message Type"}
        name={"messageType"}
        enumData={MessageTypes}
      />
      <InputComponent
        value={protocolVersion}
        name="protocolVersion"
        label="Protocol Version"
        onChange={handleChange}
      />
      <SelectComponent
        value={originatingCountry}
        onChange={handleChange}
        label={"Originating Country"}
        name={"originatingCountry"}
        enumData={OriginatingCountry}
      />
      <InputComponent
        value={publisherId}
        name="publisherId"
        label="Publisher ID"
        onChange={handleChange}
      />
    </Box>
  );
};

export default Form;
