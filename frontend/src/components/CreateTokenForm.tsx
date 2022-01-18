import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import FileInput from "components/FileInput";

interface ICreateTokenFormProps {
  formState: any;
  setFileError: React.Dispatch<any>;
  handleInputChange: React.Dispatch<any>;
  setFile: React.Dispatch<any>;
  handleCreateToken: React.Dispatch<any>;
  fileError: boolean;
}

// image: "",
// name: "",
// description: "",
// value: "",

const CreateTokenForm: React.FC<ICreateTokenFormProps> = ({
  formState,
  setFileError,
  handleInputChange,
  setFile,
  handleCreateToken,
  fileError,
}) => {
  return (
    <Grid
      item
      xs={12}
      md={6}
      sx={{
        p: 2,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Typography sx={{ mb: 2 }} variant="h4" textAlign="center">
          Token Meta
        </Typography>
        <Stack sx={{ mt: 1 }} spacing={2}>
          <TextField
            id="outlined-name"
            label="Name"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            id="outlined-name"
            label="Value"
            name="value"
            value={formState.value}
            onChange={handleInputChange}
            fullWidth
            type="number"
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />
          <TextField
            id="outlined-name"
            label="Description"
            multiline
            name="description"
            rows={7}
            value={formState.description}
            onChange={handleInputChange}
            fullWidth
          />
          {fileError && (
            <Box>
              <Typography sx={{ mt: 2 }} color="red">
                {fileError}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
      <Box sx={{ alignSelf: "end", mt: "auto" }}>
        <Button
          variant="contained"
          component="label"
          color="secondary"
          sx={{ mr: 2 }}
        >
          Upload File
          <FileInput setFile={setFile} setFileError={setFileError} />
        </Button>
        <Button
          variant="contained"
          onClick={handleCreateToken}
          component="label"
          color="success"
        >
          Create Token
        </Button>
      </Box>
    </Grid>
  );
};

export default CreateTokenForm;
