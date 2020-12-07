import React, { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import DataConditionsModal from "./DataConditionsModal/";
import BotDeleteModal from "./BotDeleteModal";
import BotSaveModal from "./BotSaveModal";
import GenerateCodeModal from "./GenerateCodeModal";
import ManualEntryModal from "./ManualEntryModal";
import BotConfigModal from "./BotConfigModal";
import ProcessConfigModal from "./ProcessConfigModal";
import VariableAddModal from "./VariableAddModal";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

export const Modals = {
  DataConditionsModal,
  BotDeleteModal,
  BotSaveModal,
  GenerateCodeModal,
  ManualEntryModal,
  BotConfigModal,
  ProcessConfigModal,
  VariableAddModal,
  KeyboardShortcutsModal,
};

const ModalManager = (props) => {
  const { currentModal, setCurrentModal } = useContext(ModalContext);
  const handleClose = () => setCurrentModal(null);

  if (currentModal) {
    const ModalComponent = Modals[currentModal.name];
    return (
      <ModalComponent
        handleClose={handleClose}
        open={true}
        {...currentModal.props}
      />
    );
  }
  return null;
};

export default ModalManager;
