import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import CreateTokenForm from "components/CreateTokenForm";

import { HOST_URL } from "const";

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
  const navigate = useNavigate();
  const [_n, { setWarning, setSuccess }] = useNotificationContext();
  const [dappState, _] = useDappContext();

  // Handle file input state
  const [file, setFile] = React.useState<any>();
  const [fileError, setFileError] = React.useState<any>();

  // Used to display image in card
  const [imageSrc, setImageSrc] = React.useState<any>();

  const [formState, setFormState] = React.useState(initialFormState);

  const getLatestTokenId = async (): Promise<string> => {
    const pixelNFTContract = dappState.contracts.pixelNFT;

    try {
      const bigNumTokenId = await pixelNFTContract.totalSupply();
      return bigNumTokenId.toString();
    } catch (err) {
      setWarning(err);
    }
  };

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

  const handleFileChange = () => {
    setFileError(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSave = async (newTokenId: string): Promise<boolean> => {
    const url = `${HOST_URL}/save-image`;
    var formData = new FormData();
    formData.append("file", file);
    formData.append("tokenId", `${newTokenId}`);

    try {
      await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (err) {
      setWarning(err.message);
      return false;
    }
  };

  const isValidForm = () => {
    if (
      formState.name === "" ||
      formState.value === "" ||
      formState.description === ""
    ) {
      return false;
    }
    return true;
  };

  const handleMetaDataSave = async (newTokenId: string): Promise<boolean> => {
    const url = `${HOST_URL}/save-meta`;
    const tokenMeta: ITokenMeta = {
      name: formState.name,
      description: formState.description,
      imageUri: `${HOST_URL}/token-image/${newTokenId}.jpg`,
      attributes: [],
    };

    const tokenInfo: ITokenInfo = {
      tokenId: newTokenId,
      author: dappState.currentAccount,
      tokenMeta,
    };

    try {
      await axios.post(url, tokenInfo);
      return true;
    } catch (err) {
      setWarning(err.message);
      return false;
    }
  };

  const handleCreateToken = async () => {
    const pixelNFTContract = dappState.contracts.pixelNFT;
    const newTokenId = await getLatestTokenId();

    // Check file exists and save image
    if (file) {
      const imageSaved = await handleImageSave(newTokenId);
      if (!imageSaved) {
        setWarning("An error occurred during image save");
        return;
      }
    } else {
      setWarning("No image uploaded");
      return;
    }

    // Check form is valid
    const validForm = isValidForm();
    if (!validForm) {
      setWarning("Form data is not valid");
      return;
    }

    // Save meta data
    const metaSaved = await handleMetaDataSave(newTokenId);
    if (!metaSaved) {
      setWarning("There was an error saving meta data");
      return;
    }

    // Create token on block chain
    try {
      const res = await pixelNFTContract.createToken(
        `${HOST_URL}/token-meta/${newTokenId}`
      );
      navigate(`/marketplace`);
      setSuccess(`Token successfully create, tx hash: ${res.hash}`);
    } catch (err) {
      setWarning(err.message);
    }
  };

  // Handle file input change
  React.useEffect(() => {
    if (file) {
      handleFileChange();
    }
  }, [file]);

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
              <Skeleton variant="rectangular" height={480} sx={{ m: 2 }} />
            )}
          </Card>
          <Grid />
        </Grid>
        <CreateTokenForm
          formState={formState}
          setFileError={setFileError}
          handleInputChange={handleInputChange}
          setFile={setFile}
          handleCreateToken={handleCreateToken}
          fileError={fileError}
        />
      </Grid>
    </Paper>
  );
};

export default CreateListing;
