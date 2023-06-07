import { TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  heading: string;
}
export const BodyHeading = (props: Props) => {
  const { heading } = props;

  //TODO: change font
  return <StyledTypography variant="body1">{heading}</StyledTypography>;
};

const StyledTypography = styled(Typography)(({}) => ({
  fontSize: "16px",
}));
