import Navbar from "./Navbar";
import Box from "@mui/material/Box";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Box>
        <Navbar />
      </Box>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Box>
  );
}
