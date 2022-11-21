import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import YouTubeIcon from "@mui/icons-material/YouTube";

import AsyncButton from "../ui-kit/AsyncButton";
import { FormattedMessage, useIntl } from "react-intl";

const MissingScopesModal = ({ onClose, onConfirm, scopes }) => {
  const intl = useIntl();

  return (
    <>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Additional permissions are required to perform this action"
          id="missingScopesModal.title"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <List dense>
            {scopes.includes("https://www.googleapis.com/auth/youtube") && (
              <ListItem>
                <ListItemIcon>
                  <YouTubeIcon fontSize="large" />
                </ListItemIcon>
                <ListItemText
                  primary={intl.formatMessage({
                    defaultMessage: "Manage your YouTube account",
                    id: "missingScopesModal.manageYoutube",
                  })}
                />
              </ListItem>
            )}
          </List>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <AsyncButton onClick={onClose} autoFocus>
          Cancel
        </AsyncButton>
        <AsyncButton variant="contained" color="error" onClick={onConfirm}>
          Grant permissions
        </AsyncButton>
      </DialogActions>
    </>
  );
};

export default MissingScopesModal;
