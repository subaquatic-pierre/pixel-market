import React from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";
import { useNavigate } from "react-router";

const RequestAuthorship: React.FC = () => {
  const [formState, setFormState] = React.useState<any>({
    name: "",
    email: "",
  });
  const navigate = useNavigate();
  const [_n, { setSuccess, setWarning }] = useNotificationContext();
  const [dappState, _d] = useDappContext();
  const [contract, setContract] = React.useState<any>(null);

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

  const submitTransaction = async () => {
    try {
      const resHash = await contract.requestAuthorship(
        formState.name,
        formState.email
      );
      setFormState({ name: "", email: "" });
      setSuccess("Your request has been submitted");
      navigate("/tokens");
    } catch (err) {
      setWarning(err.message);
    }
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (!formState.name || !formState.email) {
      setWarning("Form fields cannot be empty");
      return;
    }
    submitTransaction();
  };

  React.useEffect(() => {
    if (dappState.isInitialized)
      setContract(dappState.contracts.pixelMarketplace);
  }, [dappState]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <PersonAddIcon />
        </Avatar>
        <Typography sx={{ mt: 2 }} component="h1" variant="h4">
          Request Authorship
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Divider />
          <Grid container maxWidth="sm" sx={{ mt: 2 }}>
            <Grid item>
              <Typography>
                In order to list your items on the marketplace you first need to
                apply for Author Status. Once you have sent the request an admin
                will confirm your status, please check your email for updates.
                The request can take up to 24 hours to process
              </Typography>
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            onChange={handleInputChange}
            required
            fullWidth
            name="name"
            value={formState.name}
            label="Full Name"
            id="name"
            autoFocus
          />
          <TextField
            margin="normal"
            onChange={handleInputChange}
            value={formState.email}
            required
            fullWidth
            id="email"
            type="email"
            label="Email Address"
            name="email"
          />
          <Button
            onClick={handleButtonClick}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Request
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequestAuthorship;
