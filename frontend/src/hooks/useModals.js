import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
} from "react";
import noop from "lodash/noop";
import Dialog from "@mui/material/Dialog";

import ConfirmationModal from "../modals/ConfirmationModal";
import MissingScopesModal from "../modals/MissingScopesModal";

const ModalsContext = createContext({
  modalTypes: {},
  openModal: noop,
  closeModal: noop,
});

const modalTypesComponents = {
  Confirmation: ConfirmationModal,
  MissingScopes: MissingScopesModal,
};

export const ModalsProvider = ({ children }) => {
  const [type, setType] = useState(null);
  const [props, setProps] = useState(null);

  const openModal = useCallback((type, props) => {
    setType(type);
    setProps(props);
  }, []);

  const modalTypes = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(modalTypesComponents).map((name) => [name, name])
      ),
    []
  );

  const Modal = modalTypesComponents[type];

  const closeModal = useCallback(() => {
    setType(null);
    setProps(null);
  }, []);

  const handleClose = useCallback(async () => {
    try {
      if (typeof props?.onClose === "function") {
        await props.onClose();
      }
    } finally {
      closeModal();
    }
  }, [closeModal, props]);

  const value = {
    modalTypes,
    openModal,
    closeModal,
  };

  return (
    <ModalsContext.Provider value={value}>
      {children}
      {Modal && (
        <Dialog open maxWidth="xs">
          <Modal {...props} onClose={handleClose}></Modal>
        </Dialog>
      )}
    </ModalsContext.Provider>
  );
};

export const useModals = () => useContext(ModalsContext);
