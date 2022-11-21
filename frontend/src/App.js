import React, { useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import Typography from "@mui/material/Typography";
import { SnackbarProvider } from "notistack";
import { createGlobalStyle } from "styled-components/macro";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { AuthProvider } from "./hooks/useAuth";
import Root from "./modules/Root";
import HomePage from "./modules/Home";
import { AppContextProvider } from "./AppContext";
import { ModalsProvider } from "./hooks/useModals";
import { I18nProvider, useLocales } from "./hooks/useLocales";
import FullSizeContainer from "./ui-kit/FullSizeContainer";

const ErrorPage = () => {
  const error = useRouteError();
  console.error("Error =>", error);

  return (
    <FullSizeContainer>
      {error.status === 404 ? (
        <Typography variant="body1">Not found</Typography>
      ) : (
        <Typography variant="body1">Something went wrong</Typography>
      )}
    </FullSizeContainer>
  );
};

const MainApp = () => {
  const { locales } = useLocales();

  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: `/:locale`,
          element: <Root />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "",
              element: <HomePage />,
            },
          ],
        },
        {
          path: "/:locale",
          element: <Root />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "",
              element: <HomePage />,
            },
          ],
        },
        {
          path: "/",
          element: <Root />,
          errorElement: <ErrorPage />,
          children: [
            {
              path: "",
              element: <HomePage />,
            },
          ],
        },
      ]),
    []
  );

  return <RouterProvider router={router} />;
};

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "inherit",
        },
      },
    },
  },
});

const GlobalStyles = createGlobalStyle`
  body, html, #root {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyles />
      <I18nProvider>
        <SnackbarProvider>
          <AuthProvider>
            <ModalsProvider>
              <AppContextProvider>
                <ThemeProvider theme={theme}>
                  <MainApp />
                </ThemeProvider>
              </AppContextProvider>
            </ModalsProvider>
          </AuthProvider>
        </SnackbarProvider>
      </I18nProvider>
    </>
  );
};

export default App;
