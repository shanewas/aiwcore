import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Box,
  IconButton,
  Button,
} from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import TypeScreenshot from "./TypeScreenshot";
import TypeLink from "./TypeLink";
import TypeClick from "./TypeClick";
import TypeLoadData from "./TypeLoadData";
import SelectorInput from "../../layout/input/SelectorInput";
import TypeExtractData from "./TypeExtractData";

const initFields = {
  ocr: false,
  MenualData: "",
  label: "",
  link: "",
};
const types = ["LoadData", "link", "click", "ScreenShot", "Extract Data"];
const inputTypes = ["null", "radio", "password", "text", "checkbox", "email"];
const extractDataFields = ["xpath", "label", "value"];

export default ({
  open,
  handleClose,
  editStep,
  clearConfig,
  currentProcess,
  variables,
}) => {
  const [process, setProcess] = useState({});
  const [ocr, setOcr] = useState(false);
  const [extractField, setExtractField] = useState("");

  // [TODO] temp solution - Need to fix in electron to set default value as empty string
  // [TODO] add default label property
  useEffect(() => {
    const tProcess = { ...initFields, ...currentProcess };
    for (const v in tProcess) {
      if (typeof tProcess[v] === "undefined") tProcess[v] = "";
    }
    if (tProcess._type === "ScreenShot") setOcr(tProcess.ocr);
    setProcess(tProcess);
  }, []);

  const handleExtractFieldChange = (e) => setExtractField(e.target.value);

  const handleTypeChange = (type) => (e) => {
    setProcess((p) => ({ ...p, [type]: e.target.value }));
  };

  const handleChange = (e) => {
    e.persist();
    setProcess((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const tProcess = { ...process };
    if (tProcess._type === "ScreenShot") tProcess.ocr = ocr;
    editStep(tProcess);
    handleClose();
  };
  console.log(extractField);

  return (
    <Dialog open={open} fullWidth>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>Process Configuration</Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon size={16} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box mb={1}>
          <SelectorInput
            value={useMemo(() => process._type, [process._type])}
            onChange={useCallback((e) => handleTypeChange("_type")(e), [])}
            options={types}
            placeholder="Process Type"
          />
        </Box>
        {process._type === "ScreenShot" && (
          <TypeScreenshot onChange={() => setOcr((o) => !o)} value={ocr} />
        )}
        {process._type === "link" && (
          <TypeLink onChange={handleChange} value={process.link} />
        )}
        {process._type === "click" && (
          <TypeClick onChange={handleChange} value={process} />
        )}
        {process._type === "LoadData" && (
          <TypeLoadData
            onChange={handleChange}
            value={process}
            onSelectorChange={handleTypeChange("type")}
            inputTypes={inputTypes}
          />
        )}
        {process._type === "Extract Data" && (
          <TypeExtractData
            extractField={extractField}
            extractDataFields={extractDataFields}
            onExtractFieldChange={handleExtractFieldChange}
            variables={variables}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="text">
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};
