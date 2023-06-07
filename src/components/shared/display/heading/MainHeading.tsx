import { TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props {
  heading: string;
}
export const MainHeading = (props: Props) => {
  const { heading } = props;

  //TODO: change font
  return <StyledTypography variant="h1">{heading}</StyledTypography>;
};

const StyledTypography = styled(Typography)(({}) => ({
  fontSize: "32px",
}));
