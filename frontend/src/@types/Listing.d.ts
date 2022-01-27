interface IListingInfo {
  listingId: string;
  author: string;
  status: number;
  tokenId: string;
  value: string;
}

interface IListingItem {
  tokenId: number;
  tokenUri: string;
  listingInfo: IListingInfo;
}
