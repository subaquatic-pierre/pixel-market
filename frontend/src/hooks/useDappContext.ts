import React from "react";
import { DappContext } from "../context/DappContext";

export default function useDappContext() {
  return React.useContext(DappContext);
}
