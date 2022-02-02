const getAvailableListings = async (
  allListings: IListingInfo[],
  dappState: IDappState
): Promise<IListingInfo[]> => {
  const NFTContract = dappState.contracts.pixelNFT;

  const availableListings: IListingInfo[] = [];

  for (let i = 0; i < allListings.length; i++) {
    const listing = allListings[i];
    const tokenId = listing.tokenId;

    // Check owner of token is author of listing
    const tokenOwner = await NFTContract.ownerOf(tokenId);
    if (tokenOwner.toLowerCase() !== listing.author.toLowerCase()) {
      // TODO: Notify admins listing should be de-listed
      continue;
    }

    if (listing.status === 0) {
      availableListings.push(listing);
    }
  }

  return availableListings;
};

export default getAvailableListings;
