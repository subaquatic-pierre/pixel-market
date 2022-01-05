import { Contract } from "ethers";

import { AlertColor } from "@mui/material/Alert";
import { BaseProvider } from "@ethersproject/providers";

export interface INotificationState {
  isOpen: boolean;
  message: string;
  color: AlertColor;
}

export interface IDappState {
  isInitialized: boolean;
  loading: boolean;
  currentAccount: string | undefined;
  chainId: string | undefined;
  contracts:
    | {
        [name: string]: Contract;
      }
    | undefined;
  provider: BaseProvider | undefined;
}

export const initialDappState: IDappState = {
  isInitialized: false,
  loading: true,
  currentAccount: undefined,
  chainId: undefined,
  provider: undefined,
  contracts: undefined,
};

export const initialNotificationState: INotificationState = {
  isOpen: false,
  message: "",
  color: "success",
};
