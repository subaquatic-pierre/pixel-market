import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import AdminListToolbar from "components/AdminListToolbar";

const columns: GridColDef[] = [
  { field: "adminId", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "status", headerName: "Active Status", width: 150 },
  { field: "walletAddress", headerName: "Wallet Address", width: 370 },
];

interface IAdminRow {
  id: number;
  name: string;
  email: string;
  adminId: string;
  walletAddress: string;
  status: string;
}

const AdminList = () => {
  const [dappState, _] = useDappContext();
  const [admins, setAdmins] = React.useState<IAdminRow[]>([]);
  const [_n, { setWarning }] = useNotificationContext();

  const getAdmins = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const adminCountBigNum = await marketplaceContract.adminCount();
    const adminCount = Number(adminCountBigNum.toString());
    const _admins: IAdminRow[] = [];

    for (let i = 0; i < adminCount; i++) {
      const adminRes = await marketplaceContract.admins(i);
      try {
        const _admin: IAdminRow = {
          id: adminRes.adminId.toString(),
          name: adminRes.name,
          email: adminRes.email,
          adminId: adminRes.adminId.toString(),
          walletAddress: adminRes.walletAddress,
          status: adminRes.activeStatus,
        };
        _admins.push(_admin);
      } catch (err) {
        setWarning(err.message);
      }
    }

    setAdmins(_admins);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getAdmins();
  }, [dappState]);

  return (
    <Box>
      <AdminListToolbar />
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid rows={admins} columns={columns} />
      </Paper>
    </Box>
  );
};

export default AdminList;
