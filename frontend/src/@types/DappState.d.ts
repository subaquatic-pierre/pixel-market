interface IDappState {
  isInitialized: boolean;
  loading: boolean;
  currentAccount: string | undefined;
  myListings: IListingInfo[];
  isAuthor: boolean;
  chainId: string | undefined;
  contracts:
    | {
        [name: string]: Contract;
      }
    | undefined;
  provider: BaseProvider | undefined;
}

interface INotificationState {
  isOpen: boolean;
  message: string;
  color: AlertColor;
}
