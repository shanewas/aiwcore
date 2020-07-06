import React, { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalContextProvider = (props) => {
  const [currentModal, setCurrentModal] = useState();
  return (
    <ModalContext.Provider value={{ currentModal, setCurrentModal }}>
      {props.children}
    </ModalContext.Provider>
  );
};
