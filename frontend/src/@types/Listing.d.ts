interface IListingInfo {
  listingId: string;
  author: IUser;
  status: number;
  tokenId: string;
  value: string;
}

interface IListingItem {
  tokenId: number;
  tokenUri: string;
  listingInfo: IListingInfo;
}

interface ISelectedListing {
  listingId: number;
  status: string;
  tokenId: string;
}
