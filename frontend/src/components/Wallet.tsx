import React from "react";
import { BigNumber } from "@ethersproject/bignumber";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import MailIcon from "@mui/icons-material/Mail";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface IWalletState {
  address: string;
  token: any;
  symbol: string;
  balance: number;
  txBeingSent: any;
  latestTx: any;
}

const initialWalletState: IWalletState = {
  address: "0x00",
  symbol: "",
  token: undefined,
  balance: 0,
  txBeingSent: undefined,
  latestTx: undefined,
};

const Wallet = () => {
  const [dappState, _] = useDappContext();
  const [walletState, setWalletState] =
    React.useState<IWalletState>(initialWalletState);
  const [formState, setFormState] = React.useState<any>({
    amount: "",
    toAddress: "",
  });
  const [_n, { setSuccess, setWarning }] = useNotificationContext();

  const getTokenBalance = () => {
    const token = dappState.contracts.pixelToken;
    console.log(dappState);
    console.log(token);
    const address = dappState.currentAccount;
    token.balanceOf(address).then((res) => {
      const num = res.toNumber();
      setWalletState((oldState) => ({
        ...oldState,
        balance: num,
      }));
    });
  };

  const initWalletState = async () => {
    // Get details off dappState
    const token = dappState.contracts.pixelToken;
    const address = dappState.currentAccount;

    const bigNumVal = await token.balanceOf(address);
    const balance = bigNumVal.toNumber();

    const symbol = await token.symbol();

    setWalletState((oldState) => ({
      ...oldState,
      address,
      token,
      symbol,
      balance,
    }));
  };

  const transferTokens = async (amount: string, receiver: string) => {
    // Transfer tokens
    try {
      const tx = await walletState.token.transfer(receiver, amount);
      setWalletState((oldState) => ({ ...oldState, txBeingSent: tx.hash }));
      const receipt = await tx.wait();
      setWalletState((oldState) => ({
        ...oldState,
        latestTx: receipt,
        txBeingSent: undefined,
      }));
      setSuccess(
        `Transaction successful, transaction hash: ${receipt.transactionHash}`
      );
      resetFormState();
      getTokenBalance();
    } catch (err) {
      setWarning(err.message);
    }
  };

  const resetFormState = () => {
    setFormState({ amount: "", toAddress: "" });
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

  const handleTransferButtonClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const amount: number = Number(formState.amount);
    const toAddress = formState.toAddress;

    const isDecimal = amount % 1 > 0;

    if (!amount || !toAddress) {
      setWarning("Values must be present in form");
    } else if (isDecimal) {
      setWarning("Number cannot be decimal");
    } else if (amount > walletState.balance) {
      setWarning("Insufficient amount available for transfer");
    } else {
      // Transfer tokens
      transferTokens(amount.toString(), toAddress);
    }
  };

  React.useEffect(() => {
    initWalletState();
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
          <MailIcon />
        </Avatar>
        <Typography sx={{ mt: 2 }} component="h1" variant="h4">
          Wallet
        </Typography>
        <>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs></Grid>
            <Grid item>
              <Grid item xs>
                <Typography>
                  Available Balance: {walletState.balance} {walletState.symbol}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              onChange={handleInputChange}
              required
              fullWidth
              name="amount"
              value={formState.amount}
              label="Amount"
              type="number"
              id="amount"
              autoFocus
            />
            <TextField
              margin="normal"
              onChange={handleInputChange}
              value={formState.toAddress}
              required
              fullWidth
              id="to-address"
              label="To Address"
              name="toAddress"
            />
            <Button
              onClick={handleTransferButtonClick}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Transfer
            </Button>
          </Box>
        </>
      </Paper>
    </Box>
  );
};

export default Wallet;
