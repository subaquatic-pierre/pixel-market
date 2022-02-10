import React from "react";
import { ethers } from "ethers";

// Import state variables
import { buildContracts } from "./initialContracts";
import { CHAIN_ID } from "const";
import { initialDappState } from "context/initialState";

import useNotificationContext from "hooks/useNotificationContext";

export const DappContext = React.createContext<
  [IDappState, React.Dispatch<any>]
>([initialDappState, {} as any]);

const DappContextProvider: React.FC = ({ children }) => {
  // Set initial app state
  const [_, { setError, setWarning, clearNotification }] =
    useNotificationContext();

  const [dappState, setDappState] =
    React.useState<IDappState>(initialDappState);

  // Event listener method called anytime network is changed
  const handleChainChanged = async (chainId: any) => {
    window.location.reload();
  };

  // Simple method to check correct network
  const isCorrectNetwork = async () => {
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    return chainId === CHAIN_ID;
  };

  // Called any time an account is connected or disconnected from the app
  const handleAccountsChanged = async () => {
    const correctNetwork = await isCorrectNetwork();

    try {
      // Get accounts off window ethereum object
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      // Check if accounts exist
      if (accounts.length === 0) {
        setError("Please connect your wallet");
        setDappState((oldState) => ({
          ...oldState,
          currentAccount: undefined,
        }));
        // Check correct network
      } else if (correctNetwork) {
        setDappState((oldState) => ({
          ...oldState,
          currentAccount: accounts[0],
        }));
        clearNotification();
        await completeLoadingState();
      }
      // Handle any errors
    } catch (err) {
      setError(err.message);
    }
  };

  // Used to prompt user to connect wallet to app
  const connectWallet = async () => {
    const correctNetwork = await isCorrectNetwork();
    if (correctNetwork) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            setWarning("Please connect to MetaMask.");
          } else if (err.code === -32002) {
            setWarning("Please Check Meta mask extension to connect");
          }
        });
    }
  };

  // Set app state to current network data
  const connectNetwork = async (chainId) => {
    if (!(chainId === CHAIN_ID)) {
      setError(
        "Incorrect Network, please check MetaMask and change your network"
      );
      setDappState((oldState) => ({
        ...oldState,
        currentAccount: undefined,
      }));
      return false;
    } else {
      setDappState((oldState) => ({
        ...oldState,
        chainId: chainId,
      }));
    }
  };

  // Build contracts and update state
  const initializeContracts = async (provider) => {
    setDappState((oldState) => ({
      ...oldState,
      contracts: buildContracts(provider),
    }));

    return buildContracts(provider);
  };

  const parseListingIds = (list): number[] => {
    const listingIds = list.map((listingId) => Number(listingId.toString()));
    return listingIds;
  };

  const getMyListings = async (contracts) => {
    const marketContract = contracts.pixelMarketplace;
    const listingIds: string[] = [];
    const listings: IListingInfo[] = [];

    // Get array of Ids from marketplace contract
    const bigNumTokenIds = await marketContract.getMyListingsIds();

    for (let i = 0; i < bigNumTokenIds.length; i++) {
      const tokenId = bigNumTokenIds[i].toString();
      listingIds.push(tokenId);
    }

    listingIds.forEach(async (listingId) => {
      const listingRes = await marketContract.listings(listingId);
      const listing: IListingInfo = {
        listingId: listingId,
        author: listingRes.author,
        status: listingRes.status,
        tokenId: listingRes.tokenId.toString(),
        value: listingRes.value.toString(),
      };
      listings.push(listing);
    });
    setDappState((oldState) => ({
      ...oldState,
      myListings: listings,
    }));
  };

  const checkAuthorshipStatus = async (contracts) => {
    const marketplaceContract = contracts.pixelMarketplace;
    const isAuthor = await marketplaceContract.isAuthor();

    if (isAuthor) {
      setDappState((oldState) => ({ ...oldState, isAuthor: true }));
    } else {
      setDappState((oldState) => ({ ...oldState, isAuthor: false }));
    }
  };

  // Contains all functions to be called to connect to Dapp
  const startApp = async (provider: any) => {
    // Get chain ID and connect to network
    const chainId = await window.ethereum.request({ method: "eth_chainId" });

    // Start app connection methods
    await connectNetwork(chainId);
    await connectWallet();
    const contracts = await initializeContracts(provider);
    await getMyListings(contracts);
    await checkAuthorshipStatus(contracts);
    await completeLoadingState();
  };

  const completeLoadingState = async () => {
    setDappState((oldState) => ({
      ...oldState,
      isInitialized: true,
      loading: false,
    }));
  };

  // Initialize main ethereum provider and start app
  const initializeProvider = async () => {
    if (!window.ethereum) {
      setWarning("Please install MetaMask");
    } else {
      // Set provider and start app
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setDappState((oldState) => {
        startApp(provider);
        return {
          ...oldState,
          provider,
        };
      });
    }
  };

  React.useEffect(() => {
    initializeProvider();

    // Register Ethereum event handlers
    window.ethereum.on("chainChanged", handleChainChanged);
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }, []);

  return (
    <DappContext.Provider value={[dappState, setDappState]}>
      {children}
    </DappContext.Provider>
  );
};

export default DappContextProvider;
