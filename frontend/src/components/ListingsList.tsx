import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import Paper from "@mui/material/Paper";
import useDappContext from "hooks/useDappContext";
import useNotificationContext from "hooks/useNotificationContext";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150 },
  { field: "author", headerName: "Author", width: 150 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "tokenId", headerName: "Token Id", width: 150 },
  { field: "value", headerName: "Value", width: 370 },
];

const ListingsList = () => {
  const [dappState, _] = useDappContext();
  const [listings, setListings] = React.useState<IListingInfo[]>([]);
  const [_n, { setWarning }] = useNotificationContext();

  const getListings = async () => {
    const marketplaceContract = dappState.contracts.pixelMarketplace;
    const listingCountBigNum = await marketplaceContract.listingIds();
    const listingCount = Number(listingCountBigNum.toString());
    const _listings: IListingInfo[] = [];

    for (let i = 0; i < listingCount; i++) {
      const listingRes = await marketplaceContract.listings(i);
      try {
        const _listing: IListingInfo = {
          listingId: listingRes.id,
          author: listingRes.author,
          status: listingRes.tokenId,
          tokenId: listingRes.value,
          value: listingRes.status,
        };
        _listings.push(_listing);
      } catch (err) {
        setWarning(err.message);
      }
    }

    setListings(_listings);
  };

  React.useEffect(() => {
    if (dappState.isInitialized) getListings();
  }, [dappState]);

  return (
    <Paper sx={{ height: 500, width: "100%" }}>
      <DataGrid rows={listings} columns={columns} />
    </Paper>
  );
};

export default ListingsList;
