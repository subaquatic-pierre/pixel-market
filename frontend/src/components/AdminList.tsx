import React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import AdminListToolbar from "components/AdminListToolbar";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "status", headerName: "Active Status", width: 150 },
  { field: "walletAddress", headerName: "Wallet Address", width: 370 },
];

const AdminList = () => {
  const [dappState, _] = useDappContext();
  const [admins, setAdmins] = React.useState<IUser[]>([]);
  const [_n, { setWarning }] = useNotificationContext();
  const navigate = useNavigate();

  const parseActiveStatusCode = (code: number): string => {
    switch (code) {
      case 0:
        return "None";
      case 1:
        return "Active";
      case 2:
        return "Inactive";
      default:
        return "NA";
    }
  };

  const parseUserRes = (userRes): IUser => {
    const user: IUser = {
      id: userRes.id.toString(),
      walletAddress: userRes.walletAddress,
      name: userRes.name,
      email: userRes.email,
      adminStatus: parseActiveStatusCode(userRes.adminStatus),
      authorStatus: parseActiveStatusCode(userRes.authorStatus),
    };

    return user;
  };

  const filterActiveAdmins = (users: IUser[]): IUser[] => {
    const _users: IUser[] = [];

    for (const user of users) {
      if (user.adminStatus === "Active") {
        _users.push(user);
      }
    }
    return _users;
  };

  const getAdmins = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const userAddressList = await marketplaceContract.userAddresses();
    const users: IUser[] = [];

    for (const address of userAddressList) {
      const userRes = await marketplaceContract.users(address);
      const user = parseUserRes(userRes);
      users.push(user);
    }

    const admins = filterActiveAdmins(users);

    setAdmins(admins);
  };

  const handleRowClick = ({ row }: GridRowParams) => {
    const adminId = row.id.toString();
    navigate(`/admin/${adminId}`);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getAdmins();
  }, [dappState]);

  return (
    <Box>
      <AdminListToolbar />
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          disableSelectionOnClick
          rows={admins}
          columns={columns}
          sx={{ ".MuiDataGrid-row": { "&:hover": { cursor: "pointer" } } }}
          onRowClick={handleRowClick}
        />
      </Paper>
    </Box>
  );
};

export default AdminList;
