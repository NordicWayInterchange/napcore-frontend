import { TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  heading: string;
}
export const SecondHeading = (props: Props) => {
  const { heading } = props;

  //TODO: change font
  return <StyledTypography variant="h2">{heading}</StyledTypography>;
};

const StyledTypography = styled(Typography)(({}) => ({
  fontSize: "24px",
}));
