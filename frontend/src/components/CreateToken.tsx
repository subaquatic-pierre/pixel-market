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

// Set Constants
const HOST_URL = "https://gateway.pinata.cloud/ipfs";
const PINATA_JWT = process.env.PINATA_JWT;

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

  // const uploadImage = async (filename) => {
  //   const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //   const tokenId = getTokenIdFromFilename(filename);

  //   // Get image
  //   let data = new FormData();
  //   const file = fs.createReadStream(`${IMAGE_DIR}/${filename}`);

  //   // Add image to data
  //   data.append("file", file);

  //   // Set image meta
  //   const imageMeta = JSON.stringify({
  //     name: `token-id-${tokenId}-image`,
  //   });
  //   data.append("pinataMetadata", imageMeta);

  //   const headers = {
  //     "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
  //     Authorization: `Bearer ${PINATA_JWT}`,
  //   };

  //   const options = {
  //     maxBodyLength: "Infinity",
  //     headers,
  //   };

  //   try {
  //     const axiosRes = await axios.post(url, data, options);
  //     const IpfsHash = axiosRes.data.IpfsHash;
  //     const image = `${IPFS_GATEWAY}/${IpfsHash}`;
  //     return [image, Number(tokenId)];
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const handleImageSave = async (newTokenId: string): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    var formData = new FormData();
    formData.append("file", file);

    // Set image meta
    const imageMeta = JSON.stringify({
      name: `token-id-${newTokenId}-image`,
    });
    formData.append("pinataMetadata", imageMeta);

    const headers = {
      "Content-Type": `multipart/form-data;`,
      Authorization: `Bearer ${PINATA_JWT}`,
    };

    const options = {
      maxBodyLength: -1,
      headers,
    };

    try {
      const axiosRes = await axios.post(url, formData, options);
      const IpfsHash = axiosRes.data.IpfsHash;
      const imageUrl = `${HOST_URL}/${IpfsHash}`;
      return imageUrl;
    } catch (err) {
      setWarning(err.message);
      return "";
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

  const handleMetaDataSave = async (
    tokenId: string,
    imageUrl: string
  ): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const tokenMeta: ITokenMeta = {
      name: "New Token",
      description: "The best of the Super Circle life",
      image: imageUrl,
      attributes: [
        {
          trait_type: "Background",
          value: "white",
        },
        {
          trait_type: "Body",
          value: "maroon",
        },
        {
          trait_type: "Eyes",
          value: "standard",
        },
        {
          trait_type: "Clothes",
          value: "blue_dot",
        },
        {
          trait_type: "Held Item",
          value: "nut",
        },
        {
          trait_type: "Hands",
          value: "standard",
        },
      ],
    };

    // Create metadata
    const jsonData = {
      pinataMetadata: {
        name: `token-id-${tokenId}-meta`,
      },
      pinataContent: tokenMeta,
    };

    const headers = {
      Authorization: `Bearer ${PINATA_JWT}`,
    };

    const options = {
      maxBodyLength: -1,
      headers,
    };

    try {
      const axiosRes = await axios.post(url, jsonData, options);
      const IpfsHash = axiosRes.data.IpfsHash;
      const tokenUri = `${HOST_URL}/${IpfsHash}`;
      return tokenUri;
    } catch (err) {
      setWarning(err.message);
      return "";
    }
  };

  const handleCreateToken = async () => {
    const pixelNFTContract = dappState.contracts.pixelNFT;
    let imageUrl = "";
    const newTokenId = await getLatestTokenId();

    // Check file exists and save image
    if (file) {
      imageUrl = await handleImageSave(newTokenId);
      if (imageUrl === "") {
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
    const tokenUri = await handleMetaDataSave(newTokenId, imageUrl);
    if (tokenUri === "") {
      setWarning("There was an error saving meta data");
      return;
    }

    // Create token on block chain
    try {
      const res = await pixelNFTContract.createToken(tokenUri);
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
