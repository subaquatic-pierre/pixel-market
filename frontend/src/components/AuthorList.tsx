import React from "react";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import AuthorListToolbar from "components/AuthorListToolbar";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "authorStatus", headerName: "Author Status", width: 150 },
  { field: "walletAddress", headerName: "Wallet Address", width: 370 },
];

const AuthorRequestList = () => {
  const [dappState, _] = useDappContext();
  const [authors, setAuthors] = React.useState<IUser[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
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

  const parseListingIds = (list): number[] => {
    const listingIds = list.map((listingId) => Number(listingId.toString()));
    return listingIds;
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

  const getAuthors = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const userAddressList = await marketplaceContract.userAddresses();
    const users: IUser[] = [];

    for (const address of userAddressList) {
      const userRes = await marketplaceContract.users(address);
      console.log(userRes);
      const user = parseUserRes(userRes);
      users.push(user);
    }

    setAuthors(users);
  };

  const handleRowClick = ({ row }: GridRowParams) => {
    const authorId = row.id.toString();
    navigate(`/author/${authorId}`);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getAuthors();
  }, [dappState]);

  return (
    <Box>
      {selected.length > 0 && <AuthorListToolbar selected={selected} />}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          onRowClick={handleRowClick}
          disableSelectionOnClick
          rows={authors}
          columns={columns}
          sx={{ ".MuiDataGrid-row": { "&:hover": { cursor: "pointer" } } }}
        />
      </Paper>
    </Box>
  );
};

export default AuthorRequestList;
