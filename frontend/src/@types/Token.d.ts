interface ITokenMeta {
  name: string;
  image: string;
  description?: string;
  attributes: ITokenMetaAttributes[];
}

interface ITokenInfo {
  tokenId: string;
  author: string;
  tokenMeta: ITokenMeta;
}

interface ITokenMetaAttributes {
  trait_type: string;
  value: string;
}

interface ITokenIdToUriMap {
  tokenId: string;
  tokenUri: string;
}
