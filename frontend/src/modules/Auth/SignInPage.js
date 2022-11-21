import { useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ListItemText from "@mui/material/ListItemText";
import Container from "@mui/material/Container";

import GoogleIcon from "@mui/icons-material/Google";

import { useAuth } from "../../hooks/useAuth";
import LocaleSelect from "../../ui-kit/LocaleSelect";

const SignInPage = ({ onSignIn, error }) => {
  const intl = useIntl();
  return (
    <Container
      maxWidth="xs"
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2}>
        <LocaleSelect />
        <Button onClick={onSignIn} startIcon={<GoogleIcon />} size="large">
          <FormattedMessage
            id="signInPage.signInWithGoogle"
            defaultMessage="Sign in with Google"
          />
        </Button>
        <Alert severity="info">
          <FormattedMessage
            defaultMessage="Additional permissions are required to read your Youtube
          subscriptions. You can remove permission anytime from your"
            id="signInPage.additionalPermissions"
          />{" "}
          <Link
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FormattedMessage
              defaultMessage="Google Account"
              id="signInPage.googleAccount"
            />
          </Link>
          .
          <List dense>
            <ListItem>
              <ListItemIcon>
                <YouTubeIcon fontSize="large" />
              </ListItemIcon>
              <ListItemText
                primary={intl.formatMessage({
                  id: "signInPage.viewPermission",
                  defaultMessage: "View your YouTube account",
                })}
              />
            </ListItem>
          </List>
        </Alert>
        {error && (
          <Alert severity="error">
            {["Missing required scopes", "access_denied"].includes(error) ? (
              <FormattedMessage
                defaultMessage="Required account permissions wasn't granted."
                id="signInPage.missingRequiredScopes"
              />
            ) : (
              <FormattedMessage
                defaultMessage="Something went wrong."
                id="signInPage.somethingWentWrong"
              />
            )}
          </Alert>
        )}
      </Stack>
    </Container>
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
