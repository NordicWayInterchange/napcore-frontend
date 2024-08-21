import { Breadcrumbs, ButtonProps, Link } from "@mui/material";
import React from "react";
import { Box } from "@mui/system";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";

interface Props extends ButtonProps {
  text: string;
}
export const BreadcrumbNavigation = (props: Props) => {
  const { text} = props;

  const getUrl = () => {
    return text === 'Subscriptions' ? "/subscriptions" : text ==='Deliveries' ?
      '/deliveries' : '/capabilities';
  };

  return (
    <Box sx={{ width: '100%', py: 2, ml: -.5}}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Link
          href={getUrl()}
          sx={{ display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'grey', cursor: 'pointer',
            mr: 1 }}
        >
          <NavigateBeforeIcon />
        </Link>
        <Breadcrumbs sx={{ ml: -1.25 }}>
          <Link
            underline="hover"
            color="inherit"
            href={getUrl()}
            sx={{
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationThickness: '1px',
              '&:hover': {
                textDecorationThickness: '2px',
              },
            }}
          >
            {text}
          </Link>
        </Breadcrumbs>
      </Box>
    </Box>
  );
};