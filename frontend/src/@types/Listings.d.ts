interface IMarketplaceItemMeta {
  tokenId: number;
  imageUrl: string;
  name: string;
  description?: string;
  value: number;
  author: string;
  dateCreated: string;
}

interface IMarketplaceListingInfo {
  listingId: string;
  author: string;
  status: string;
  tokenId: string;
  value: string;
}
