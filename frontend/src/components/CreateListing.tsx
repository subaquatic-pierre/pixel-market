import React from "react";
import { useNavigate } from "react-router-dom";
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

import { HOST_URL } from "const";

export interface TokenMetaAttributes {
  [key: string]: string;
}

export interface TokenMeta {
  tokenId: string;
  tokenUri: string;
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
  const [tokenId, setTokenId] = React.useState<string>("");

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
        setTokenId(strNum);
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
    formData.append("tokenId", tokenId);

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

  const handleMetaDataSave = (): boolean => {
    const url = `${HOST_URL}/save-meta`;
    const data: TokenMeta = {
      tokenId: tokenId,
      tokenUri: `${`${HOST_URL}/meta/token-id-${tokenId}.json`}`,
      name: "Cool NFT",
      description: "This is the first description of an NFT",
      imageUrl: `${HOST_URL}/token-image/${tokenId}.jpg`,
      attributes: [{ amount: "42" }, { author: "The Amazing Creator" }],
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
    if (!handleMetaDataSave()) {
      setWarning("There was an error saving meta data");
      return;
    }

    // Create token on block chain
    if (tokenId) {
      pixelNFTContract
        .createToken(`${`${HOST_URL}/meta/token-id-${tokenId}.json`}`)
        .then((res) => {
          navigate(`/marketplace/${tokenId}`);
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
            {/* <Button
              sx={{ mr: 3 }}
              variant="contained"
              onClick={handleImageSave}
              component="label"
            >
              Save Image
            </Button> */}
            <Button
              variant="contained"
              onClick={handleCreateToken}
              component="label"
            >
              Create Token
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CreateListing;
