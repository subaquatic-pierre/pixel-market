import React from "react";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import UserLogo from "components/UserLogo";

import { CHAIN_ID } from "const";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

interface ITopNavProps {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

const TopNav: React.FC<ITopNavProps> = ({
  drawerWidth,
  handleDrawerToggle,
}) => {
  const [correctNetwork, setCorrectNetwork] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState("");
  const [dappContext, _] = useDappContext();
  const [_n, { setWarning }] = useNotificationContext();

  React.useEffect(() => {
    setWalletAddress(dappContext.currentAccount);
  }, [dappContext]);

  const isCorrectNetwork = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    setCorrectNetwork(chainId === CHAIN_ID);
  };

  const connectWallet = async () => {
    if (correctNetwork) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((res) => {
          window.location.reload();
        })
        .catch((err) => {
          alert(err.message);
          if (err.code === 4001) {
            setWarning("Please connect to MetaMask");
          } else if (err.code === -32002) {
            setWarning("Please Check Meta mask extension to connect");
          }
        });
    }
  };

  const changeNetwork = () => {
    window.ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID }],
      })
      .then((res) => {
        window.location.reload();
      })
      .catch((err) => {
        setWarning(err.message);
      });
  };

  const displayTopNavItems = () => {
    if (correctNetwork) {
      if (walletAddress) {
        return <UserLogo walletAddress={walletAddress} />;
      } else {
        return (
          <Button onClick={connectWallet} variant="contained" size="large">
            CONNECT WALLET
          </Button>
        );
      }
    } else {
      return (
        <Button
          onClick={changeNetwork}
          variant="contained"
          size="large"
          color="error"
        >
          CHANGE NETWORK
        </Button>
      );
    }
  };

  React.useEffect(() => {
    isCorrectNetwork();
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        elevation={0}
        color="transparent"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ ml: "auto", display: { xs: "none", sm: "flex" } }}>
            {displayTopNavItems()}
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default TopNav;
