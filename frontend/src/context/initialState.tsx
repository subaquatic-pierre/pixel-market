const initialDappState: IDappState = {
  isInitialized: false,
  loading: true,
  currentAccount: undefined,
  chainId: undefined,
  provider: undefined,
  contracts: undefined,
};

const initialNotificationState: INotificationState = {
  isOpen: false,
  message: "",
  color: "success",
};

export { initialDappState, initialNotificationState };
