interface ITokenMeta {
  name: string;
  imageUri: string;
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
  imageUri: string;
  attributes: ITokenMetaAttributes[];
}

interface ITokenIdToUriMap {
  tokenId: string;
  tokenUri: string;
}
