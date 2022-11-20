import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import AsyncButton from "../ui-kit/AsyncButton";

const ConfirmationModal = ({ onClose, onConfirm, message }) => {
  return (
    <>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <AsyncButton onClick={onClose} autoFocus>
          Cancel
        </AsyncButton>
        <AsyncButton variant="contained" color="error" onClick={onConfirm}>
          Confirm
        </AsyncButton>
      </DialogActions>
    </>
  );
};

export default ConfirmationModal;
