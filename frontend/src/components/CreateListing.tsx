import React from "react";

import axios from "axios";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
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
  const [imageSrc, setImageSrc] = React.useState<any>();
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

  const handleImageChange = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(image);
  };

  async function postData(url = "") {
    const response = await fetch(url, {
      method: "POST",
      mode: "no-cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response;
  }

  const handleFormSubmit = (url: string) => {
    const data = { answer: 42 };

    axios
      .post(url, data)
      .then((res) => console.log(res))
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    if (image) {
      handleImageChange();
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
            {image ? (
              <CardMedia
                component="img"
                image={imageSrc}
                alt="random"
                height={500}
              />
            ) : (
              <Skeleton variant="rectangular" height={500} />
            )}
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
            </Box>
          </Card>
          <Grid />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2 }}>
            <Button
              sx={{ mr: 3 }}
              variant="contained"
              onClick={() =>
                handleFormSubmit("http://localhost:8080/save-image")
              }
              component="label"
            >
              Save Image
            </Button>
            <Button
              variant="contained"
              onClick={() =>
                handleFormSubmit("http://localhost:8080/save-meta")
              }
              component="label"
            >
              Save Meta
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateListing;
