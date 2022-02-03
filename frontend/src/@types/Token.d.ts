interface ITokenMeta {
  name: string;
  imageUrl: string;
  description?: string;
  dateCreated?: string;
}

interface ITokenInfo {
  tokenId: string;
  author: string;
  tokenMeta: ITokenMeta;
}

interface ITokenMetaAttributes {
  [key: string]: string;
}

interface ITokenFormMeta {
  tokenId: number;
  name: string;
  description: string;
  imageUrl: string;
  attributes: ITokenMetaAttributes[];
}

interface ITokenIdToUriMap {
  tokenId: string;
  tokenUri: string;
}
