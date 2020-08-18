import React from "react";
import { Grid } from "@material-ui/core";
import SelectorInput from "../../layout/input/SelectorInput";

export default ({
  onChange,
  extractField,
  extractDataFields,
  variable,
  variables,
}) => {
  console.log("%c TYPE EXTRACT DATA ", "background: #222; color: #bada55");
  return (
    <Grid container direction="column" spacing={3}>
      <Grid item>
        <SelectorInput
          value={extractField}
          onChange={onChange}
          name="variableField"
          options={extractDataFields}
          placeholder="Save"
        />
      </Grid>
      <Grid item>
        <SelectorInput
          options={variables}
          name="variableName"
          value={variable}
          onChange={onChange}
          optionsConfigure={{ id: "id", label: "name", value: "name" }}
          placeholder="Variable"
        />
      </Grid>
    </Grid>
  );
};