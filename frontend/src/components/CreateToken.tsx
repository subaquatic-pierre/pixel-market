import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import CreateTokenForm from "components/CreateTokenForm";

import { HOST_URL } from "const";

export interface TokenMetaAttributes {
  [key: string]: string;
}

export interface TokenMeta {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  attributes: TokenMetaAttributes[];
}

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
  // Get pixel NFT contract from dapp state
  const [dappState, _] = useDappContext();
  const [pixelNFTContract, setPixelNFTContract] = React.useState<any>();

  // Get latest token Id from query to the blockchain
  const [tokenId, setTokenId] = React.useState<number>();

  // Handle file input state
  const [file, setFile] = React.useState<any>();
  const [fileError, setFileError] = React.useState<any>();

  // Used to display image in card
  const [imageSrc, setImageSrc] = React.useState<any>();

  const [formState, setFormState] = React.useState(initialFormState);

  // Query contract for total token supply, set latest token Id
  const getLatestTokenId = async () => {
    pixelNFTContract
      .totalSupply()
      .then((res) => {
        const bigNum = res;
        const strNum = bigNum.toString();
        setTokenId(Number(strNum) + 1);
      })
      .catch((err) => {
        setWarning(err);
      });
  };

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
    setFileError(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSave = () => {
    const url = `${HOST_URL}/save-image`;
    var formData = new FormData();
    formData.append("file", file);
    formData.append("tokenId", `${tokenId}`);

    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((err) => {
        console.error(setWarning(err.message));
      });
  };

  const isValidForm = () => {
    console.log(formState);
    if (
      formState.name === "" ||
      formState.value === "" ||
      formState.description === ""
    ) {
      return false;
    }
    return true;
  };

  const handleMetaDataSave = (): boolean => {
    const url = `${HOST_URL}/save-meta`;
    const data: TokenMeta = {
      tokenId: tokenId,
      name: formState.name,
      description: formState.description,
      imageUrl: `${HOST_URL}/token-image/${tokenId}.jpg`,
      attributes: [
        { amount: formState.value },
        { author: dappState.currentAccount },
      ],
    };

    axios.post(url, data).catch((err) => {
      console.error(setWarning(err.message));
      return false;
    });
    return true;
  };

  const handleCreateToken = () => {
    if (file) {
      handleImageSave();
    } else {
      setWarning("No image uploaded");
      return;
    }
    if (!isValidForm()) {
      setWarning("Form data is not valid");
      return;
    }
    if (!handleMetaDataSave()) {
      setWarning("There was an error saving meta data");
      return;
    }

    // Create token on block chain
    if (tokenId) {
      pixelNFTContract
        .createToken(`${HOST_URL}/token-meta/${tokenId}`)
        .then((res) => {
          navigate(`/marketplace`);
          setSuccess(`Token successfully create, tx hash: ${res.hash}`);
        })
        .catch((err) => {
          setWarning(err.message);
        });
    }
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
                sx={{ p: 2 }}
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
