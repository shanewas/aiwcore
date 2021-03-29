import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  makeStyles,
  FilledInput,
} from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { ModalContext } from "../../../context/ModalContext";
import { createGroup } from "../../../Store/actions";

const colors = [
  "#61BD4F",
  "#F2D600",
  "#FF9F1A",
  "#F56E5A",
  "#E195FE",
  "#58FCEC",
  "#F9E7E7",
  "#EF626C",
];
const clrObj = {};
for (const c in colors)
  clrObj[`&.active&-${c}::before`] = { borderColor: colors[c] };

const useStyles = makeStyles({
  color: {
    height: "30px",
    width: "30px",
    borderRadius: "50px",
    marginRight: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    cursor: "pointer",

    "&.active::before": {
      background: "none",
      borderRadius: "50px",
      border: "2px solid #fff",
      content: "''",
      display: "block",
      position: "absolute",
      top: "-4px",
      left: "-4px",
      right: "-4px",
      bottom: "-4px",
    },
    ...clrObj,
  },
});

const ProcessGroupModal = (props) => {
  const classes = useStyles();
  const { setCurrentToastr } = useContext(ModalContext);
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [iteration, setIteration] = useState("");
  const [groupColor, setGroupColor] = useState("");
  const groups = useSelector((state) => state.groups);

  const handleCreate = () => {
    const grpName = groupName.trim();
    if (!grpName || !groupColor)
      return setCurrentToastr({
        msg: "Please enter a name and select a color",
      });
    if (Object.keys(groups).includes(groupName))
      return setCurrentToastr({
        msg: "2 Groups cannot have the same name. Please enter another one.",
      });
    if (iteration < 1)
      return setCurrentToastr({
        msg: "Iteration count has to be more than 1",
      });
    dispatch(
      createGroup({ name: grpName.toLowerCase(), color: groupColor, iteration })
    );
    setCurrentToastr({
      msg: "Group created",
      success: true,
      anchorOrigin: {
        vertical: "top",
        horizontal: "center",
      },
    });
    props.handleClose();
  };

  return (
    <Dialog fullWidth open={true}>
      <DialogTitle>Create a new group</DialogTitle>
      <DialogContent>
        <Box>
          <FilledInput
            inputProps={{ maxLength: 12 }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disableUnderline
            fullWidth
            placeholder="Group name"
          />
          <Box my={4}>
            <FilledInput
              value={iteration}
              onChange={(e) => setIteration(e.target.valueAsNumber)}
              disableUnderline
              fullWidth
              placeholder="Iteration count"
              type="number"
            />
          </Box>
          <Typography variant="h5">Color:</Typography>
          <Box mt={2} display="flex">
            {colors.map((clr, idx) => (
              <Box
                key={clr}
                onClick={() => setGroupColor(clr)}
                className={`${classes.color} ${
                  groupColor === clr ? `active ${classes.color}-${idx}` : ""
                }`}
                style={{ backgroundColor: clr }}
              >
                {groupColor === clr && <CheckIcon />}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Box pb={2}>
          <Button
            disableElevation
            style={{ marginRight: "12px" }}
            variant="contained"
            onClick={props.handleClose}
          >
            Close
          </Button>
          <Button
            onClick={handleCreate}
            disableElevation
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ProcessGroupModal;
