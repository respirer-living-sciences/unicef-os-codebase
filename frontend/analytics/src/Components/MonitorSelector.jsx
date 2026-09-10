import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export default function MaveMonitorSelector(props) {
  const { handleSelector, data, label } = props;
  const [open, setOpen] = useState(false);
  const loading = open && data.length === 0;

  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      onChange={handleSelector}
      options={data}
      getOptionLabel={(option) =>
        option.locality
          ? `${option.locality} (${option.imei})`
          : `(${option.imei})`
      }
      loading={loading}
      size="small"
      renderInput={(params) => (
        <TextField
          {...params}
          label={label || "Select Monitor"}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
