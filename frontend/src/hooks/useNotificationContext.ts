import React from "react";
import { NotificationContext } from "../context/NotificationContext";

export default function useNotificationContext() {
  return React.useContext(NotificationContext);
}
