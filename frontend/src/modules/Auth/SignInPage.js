import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import GoogleIcon from "@mui/icons-material/Google";

import { useAuth } from "../../hooks/useAuth";
import { useMemo } from "react";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ListItemText from "@mui/material/ListItemText";

const SignInPage = ({ onSignIn, error }) => {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} maxWidth="sm">
        <Button onClick={onSignIn} startIcon={<GoogleIcon />} size="large">
          Sign in with Google
        </Button>
        <Alert severity="info">
          Additional permissions are required to read your Youtube
          subscriptions. You can remove permission anytime from your{" "}
          <Link
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Account
          </Link>
          .
          <List dense>
            <ListItem>
              <ListItemIcon>
                <YouTubeIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText primary="View your YouTube account" />
            </ListItem>
          </List>
        </Alert>
        {error && (
          <Alert severity="error">
            {["Missing required scopes", "access_denied"].includes(error) ? (
              <>Required account permissions wasn't granted.</>
            ) : (
              <>Something went wrong.</>
            )}
          </Alert>
        )}
      </Stack>
    </Box>
  );
};

const SignInPageContainer = () => {
  const { signIn } = useAuth();

  const error = useMemo(
    () => new URLSearchParams(window.location.search).get("error"),
    []
  );

  return <SignInPage onSignIn={signIn} error={error} />;
};

export default SignInPageContainer;
