import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Grid, IconButton } from "@material-ui/core";
import { Close as CloseIcon, Save as SaveIcon } from "@material-ui/icons";

export default ({ open, handleClose, code, saveCode }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>Selemium Code Generation</Grid>
          <Grid item>
            <IconButton onClick={handleClose}>
              <CloseIcon size={16} />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <SyntaxHighlighter language="python" style={atomDark}>
          {code}
        </SyntaxHighlighter>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            textTransform: "capitalize",
            backgroundColor: "black",
            color: "#fff",
          }}
          disableElevation
          variant="contained"
          onClick={saveCode}
        >
          <SaveIcon style={{ marginRight: "10px" }} /> Save Code
        </Button>
      </DialogActions>
    </Dialog>
  );
};