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
  capability?: Capability;
};

const Form = (props: Props) => {
  const { name, version, capability } = props;

  let subscription = {
    messageType: "",
    protocolVersion: "",
    originatingCountry: "",
    publisherId: "",
  };

  if (capability) {
    subscription = capability;
  }

  const [subscriptionData, setSubscriptionData] = useState(subscription);
  const [errors, setErrors] = useState({});

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
        isDisabled={!!capability}
        value={subscriptionData.messageType}
        label={"Message Type"}
        name={"messageType"}
        enumData={MessageTypes}
        onChange={handleChange}
      />
      <InputComponent
        isDisabled={!!capability}
        value={subscriptionData.protocolVersion}
        name={"protocolVersion"}
        label="Protocol Version"
        onChange={handleChange}
      />
      <SelectComponent
        isDisabled={!!capability}
        value={subscriptionData.originatingCountry}
        label={"Originating Country"}
        name={"originatingCountry"}
        enumData={OriginatingCountry}
        onChange={handleChange}
      />
      <InputComponent
        isDisabled={!!capability}
        value={subscriptionData.publisherId}
        name={"publisherId"}
        label="Publisher ID"
        onChange={handleChange}
      />
    </Box>
  );
};

export default Form;
