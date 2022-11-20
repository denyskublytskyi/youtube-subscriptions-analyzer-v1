import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { AuthProvider, useAuth } from "./hooks/useAuth";
import SignInPage from "./modules/Auth/SignInPage";
import Root from "./modules/Root";
import HomePage from "./modules/Home";
import { AppContextProvider } from "./AppContext";
import Loader from "./ui-kit/Loader";
import { ModalsProvider } from "./hooks/useModals";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);

const MainApp = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {!user && <SignInPage />}
      {user && <RouterProvider router={router}></RouterProvider>}
    </>
  );
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

const App = () => {
  return (
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
  );
};

export default App;
