const formatWalletAddress = (walletAddress: string) => {
  const start = walletAddress.slice(0, 5);
  const end = walletAddress.slice(walletAddress.length - 4);
  const text = start + "...." + end;
  return text;
};

export default formatWalletAddress;
