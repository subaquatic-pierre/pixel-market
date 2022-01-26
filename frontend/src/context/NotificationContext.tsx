import React from "react";

import { initialNotificationState } from "context/initialState";

interface INotificationMethods {
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  setInfo: (message: string) => void;
  setWarning: (message: string) => void;
  clearNotification: () => void;
}

export const NotificationContext = React.createContext<
  [INotificationState, INotificationMethods]
>([initialNotificationState, null]);

const NotificationContextProvider: React.FC = ({ children }) => {
  const [notificationState, setNotificationState] =
    React.useState<INotificationState>(initialNotificationState);

  const parseState = (oldState, message, color) => {
    return {
      ...oldState,
      isOpen: true,
      message: message,
      color: color,
    };
  };

  const clearNotification = () => {
    setNotificationState((oldState) => ({
      ...oldState,
      isOpen: false,
    }));
  };

  const setError = (message: string) => {
    setNotificationState((oldState) => parseState(oldState, message, "error"));
  };

  const setSuccess = (message: string) => {
    setNotificationState((oldState) =>
      parseState(oldState, message, "success")
    );
  };

  const setInfo = (message: string) => {
    setNotificationState((oldState) =>
      parseState(oldState, message, "warning")
    );
  };

  const setWarning = (message: string) => {
    setNotificationState((oldState) =>
      parseState(oldState, message, "warning")
    );
  };

  const notificationMethods: INotificationMethods = {
    setError,
    setSuccess,
    setInfo,
    setWarning,
    clearNotification,
  };

  return (
    <NotificationContext.Provider
      value={[notificationState, notificationMethods]}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
