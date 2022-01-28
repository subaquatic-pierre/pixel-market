const transferNFTToken = async (
  dappState: IDappState,
  listingInfo: IListingInfo
) => {
  // Get contracts
  const marketplaceContract = dappState.contracts.pixelMarketplace;
  const tokenContract = dappState.contracts.pixelToken;
  const NFTContract = dappState.contracts.pixelNFT;

  // Get item details
  const tokenId = listingInfo.tokenId;
  const itemValue = listingInfo.value;

  // Get owner of token address, and receiver of NFT
  const ownerAddress = await NFTContract.ownerOf(tokenId);
  const receiverAddress = dappState.currentAccount;

  // Set allowance for marketplace contract to spend tokens
  const approveTokenSpendRes = await tokenContract.approve(
    marketplaceContract.address,
    itemValue
  );

  const resHash = await marketplaceContract.transferToken(
    ownerAddress,
    receiverAddress,
    listingInfo.listingId,
    tokenId,
    itemValue
  );

  return resHash;
};

export default transferNFTToken;
