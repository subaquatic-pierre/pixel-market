import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

import AuthorListToolbar from "components/AuthorListToolbar";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "isActive", headerName: "Active Status", width: 150 },
  { field: "address", headerName: "Wallet Address", width: 370 },
];

interface IAuthor {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  address: string;
}

const AuthorRequestList = () => {
  const [dappState, _] = useDappContext();
  const [authors, setAuthors] = React.useState<IAuthor[]>([]);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [_n, { setWarning }] = useNotificationContext();

  const getAuthors = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const bigNumAuthorCount = await marketplaceContract.authorCount();
    const authorCount = Number(bigNumAuthorCount.toString());
    const _authors = [];

    for (let i = 0; i < authorCount; i++) {
      const authorAddress = await marketplaceContract.authorAddressList(i);
      const authorRes = await marketplaceContract.authors(authorAddress);
      try {
        const _author: IAuthor = {
          id: i,
          name: authorRes.authorName,
          email: authorRes.authorEmail,
          isActive: authorRes.isActive,
          address: authorRes.authorWallet,
        };
        _authors.push(_author);
      } catch (err) {
        setWarning(err.message);
      }
    }

    setAuthors(_authors);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getAuthors();
  }, [dappState]);

  return (
    <Box>
      {selected.length > 0 && <AuthorListToolbar selected={selected} />}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid rows={authors} columns={columns} />
      </Paper>
    </Box>
  );
};

export default AuthorRequestList;
