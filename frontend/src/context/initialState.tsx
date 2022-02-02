const initialDappState: IDappState = {
  isInitialized: false,
  loading: true,
  currentAccount: undefined,
  chainId: undefined,
  provider: undefined,
  contracts: undefined,
  myListings: [],
  isAuthor: false,
};

const initialNotificationState: INotificationState = {
  isOpen: false,
  message: "",
  color: "success",
};

export { initialDappState, initialNotificationState };
