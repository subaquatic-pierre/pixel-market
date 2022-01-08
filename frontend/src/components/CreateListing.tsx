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

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import FileInput from "components/FileInput";

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

const CreateListing = () => {
  const [_n, { setWarning }] = useNotificationContext();
  // Get pixel NFT contract from dapp state
  const [dappState, _] = useDappContext();
  const [pixelNFTContract, setPixelNFTContract] = React.useState<any>();

  // Get latest token Id from query to the blockchain
  const [latestTokenId, setLatestTokenId] = React.useState<any>();

  // Handle file input state
  const [file, setFile] = React.useState<any>();
  const [fileError, setFileError] = React.useState<any>();

  // Used to display image in card
  const [imageSrc, setImageSrc] = React.useState<any>();

  const [formState, setFormState] = React.useState(initialFormState);

  // Handle text input changes
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name;
    const value = event.target.value;

    updateFormState(field, value);
  };

  // Call update form state if text input changes
  const updateFormState = (field: string, value: string) => {
    setFormState((oldState) => ({
      ...oldState,
      [field]: value,
    }));
  };

  // Handle file change to display image on card
  const handleFileChange = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
    console.log(file);
  };

  const handleImageSave = () => {
    const url = "http://localhost:8080/save-image";
    var formData = new FormData();
    formData.append("file", file);
    formData.append("tokenId", latestTokenId);

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => console.log(res))
      .catch((err) => {
        console.error(err);
      });
  };

  // Query contract for total token supply, set latest token Id
  const getLatestTokenId = () => {
    console.log(pixelNFTContract);
    // pixelNFTContract
    //   .getBalance()
    //   .then((res) => {
    //     setLatestTokenId(res);
    //   })
    //   .catch((err) => {
    //     setWarning(err);
    //   });
  };

  // Handle file input change
  React.useEffect(() => {
    if (file) {
      handleFileChange();
    }
  }, [file]);

  // Get the latest tokenId on render
  React.useEffect(() => {
    if (pixelNFTContract) {
      getLatestTokenId();
    }
  }, [pixelNFTContract]);

  // Set NFT contract to interact with blockchain
  React.useEffect(() => {
    if (dappState.isInitialized) {
      setPixelNFTContract(dappState.contracts.pixelNFT);
    }
  }, [dappState]);

  return (
    <Paper>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{ display: "flex", flexDirection: "column" }}
            square
            elevation={0}
          >
            {file ? (
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
                <FileInput setFile={setFile} setFileError={setFileError} />
              </Button>
              {setFileError && (
                <Typography sx={{ mt: 2 }} color="red">
                  {fileError}
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
              onClick={handleImageSave}
              component="label"
            >
              Save Image
            </Button>
            <Button variant="contained" onClick={() => {}} component="label">
              Save Meta
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateListing;
