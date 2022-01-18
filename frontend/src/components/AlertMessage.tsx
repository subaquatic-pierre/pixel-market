import React from "react";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import useNotificationContext from "../hooks/useNotificationContext";

const AlertMessage: React.FC = () => {
  const [notificationState, { clearNotification }] = useNotificationContext();
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    clearNotification();
  };
  return (
    <>
      <Snackbar
        open={notificationState.isOpen}
        autoHideDuration={10000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key={"top center"}
      >
        <Alert
          onClose={handleClose}
          severity={notificationState.color}
          sx={{ minWidth: "600px" }}
          variant="filled"
        >
          {notificationState.message.message
            ? notificationState.message.message
            : notificationState.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertMessage;
