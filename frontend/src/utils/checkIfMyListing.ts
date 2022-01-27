export default function checkIfListing(
  tokenId: string,
  myListings: IListingInfo[]
): IListingInfo | null {
  let _listingInfo: IListingInfo | null = null;
  myListings.forEach((listing) => {
    if (tokenId === listing.tokenId && listing.status !== 2) {
      _listingInfo = listing;
    }
  });
  return _listingInfo;
}
