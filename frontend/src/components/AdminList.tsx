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
  const [admins, setAdmins] = React.useState<IAdmin[]>([]);
  const [_n, { setWarning }] = useNotificationContext();
  const navigate = useNavigate();

  const getAdmins = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const adminCountBigNum = await marketplaceContract.adminCount();
    const adminCount = Number(adminCountBigNum.toString());
    const _admins: IAdmin[] = [];

    for (let i = 0; i < adminCount; i++) {
      const adminRes = await marketplaceContract.admins(i);
      try {
        const _admin: IAdmin = {
          id: adminRes.id.toString(),
          name: adminRes.name,
          email: adminRes.email,
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
