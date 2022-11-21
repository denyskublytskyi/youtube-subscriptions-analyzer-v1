import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import AsyncButton from "../ui-kit/AsyncButton";
import { FormattedMessage } from "react-intl";

const ConfirmationModal = ({ onClose, onConfirm, message }) => {
  return (
    <>
      <DialogTitle>
        <FormattedMessage
          defaultMessage="Are you sure?"
          id="confirmationModal.title"
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <AsyncButton onClick={onClose} autoFocus>
          <FormattedMessage
            defaultMessage="Cancel"
            id="confirmationModal.cancel"
          />
        </AsyncButton>
        <AsyncButton variant="contained" color="error" onClick={onConfirm}>
          <FormattedMessage
            defaultMessage="Confirm"
            id="confirmationModal.confirm"
          />
        </AsyncButton>
      </DialogActions>
    </>
  );
};

export default ConfirmationModal;
