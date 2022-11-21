import { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";

import Header from "./Header";
import Footer from "./Footer";
import { useLocales } from "../../hooks/useLocales";
import { useAuth } from "../../hooks/useAuth";
import Loader from "../../ui-kit/Loader";
import SignInPage from "../Auth/SignInPage";

const Root = () => {
  const { locale } = useParams();
  const { isLoading, user } = useAuth();
  const { setLocale, locales } = useLocales();

  useEffect(() => {
    setLocale(
      locale && locales.includes(locale)
        ? locale
        : (navigator.languages?.[0] ?? navigator.language).split("-")[0]
    );
  }, [locale, setLocale]);

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <SignInPage />;
  }

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
