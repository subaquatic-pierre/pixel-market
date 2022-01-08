import React from "react";

import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

interface IFormData {
  image: any;
  url: string;
  name: string;
  description?: string;
  value: string;
  dateCreated: string;
}

const initialFormState: IFormData = {
  image: "",
  url: "",
  name: "",
  description: "",
  value: "",
  dateCreated: "",
};

interface IImageInputProps {
  setImage: React.Dispatch<any>;
  setInputError: React.Dispatch<any>;
}

const ImageInput: React.FC<IImageInputProps> = ({
  setImage,
  setInputError,
}) => {
  const handleChange = (fileInputEvent: any) => {
    const file = fileInputEvent.target.files[0];
    console.log(file);
    const fileType = "image/jpeg";
    if (file.type.match(fileType)) {
      setImage(file);
    } else {
      setInputError("File not supported!");
    }
  };

  return (
    <input
      accept="image/*"
      type="file"
      onChange={handleChange}
      style={{ display: "none" }}
    />
  );
};

const CreateListing = () => {
  const [image, setImage] = React.useState<any>();
  const [inputError, setInputError] = React.useState<any>();

  const [formState, setFormState] = React.useState(initialFormState);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const value = event.target.value;

    updateFormState(field, value);
  };

  const updateFormState = (field: string, value: string) => {
    setFormState((oldState) => ({
      ...oldState,
      [field]: value,
    }));
  };

  React.useEffect(() => {
    if (image) {
      console.log(image);
    }
  }, [image]);

  return (
    <Paper>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ display: "flex", flexDirection: "column" }}
            square
            elevation={0}
          >
            <Stack spacing={1}>
              <Skeleton variant="rectangular" height={500} />
              <Box sx={{ px: 2, pb: 2 }}>
                <Skeleton variant="text" height={50} />
                <Skeleton variant="text" height={50} />
              </Box>
            </Stack>
          </Card>
          <Grid />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Button variant="contained" component="label">
              Upload File
              <ImageInput setImage={setImage} setInputError={setInputError} />
            </Button>
            {inputError && (
              <Typography sx={{ mt: 2 }} color="red">
                {inputError}
              </Typography>
            )}

            {/* <Stack spacing={1}>
              <Skeleton variant="text" height={50} />
              <Skeleton variant="text" height={50} />
            </Stack> */}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateListing;
