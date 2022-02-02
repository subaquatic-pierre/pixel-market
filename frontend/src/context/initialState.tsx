const initialDappState: IDappState = {
  isInitialized: false,
  loading: true,
  currentAccount: undefined,
  chainId: undefined,
  provider: undefined,
  contracts: undefined,
  myListings: [],
  isAuthor: true,
};

const initialNotificationState: INotificationState = {
  isOpen: false,
  message: "",
  color: "success",
};

export { initialDappState, initialNotificationState };
