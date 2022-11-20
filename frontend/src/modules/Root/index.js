import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import Header from "./Header";
import Footer from "./Footer";

const Root = () => {
  return (
    <Stack spacing={4} sx={{ height: "100%" }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </Stack>
  );
};

export default Root;
