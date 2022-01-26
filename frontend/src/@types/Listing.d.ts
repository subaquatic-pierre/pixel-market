interface IListingInfo {
  listingId: string;
  author: string;
  status: string;
  tokenId: string;
  value: string;
}

interface IListingItem {
  tokenId: number;
  tokenUri: string;
  listingInfo: IListingInfo;
}
