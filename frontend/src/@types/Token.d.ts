interface ITokenMeta {
  tokenId: number;
  imageUrl: string;
  name: string;
  description?: string;
  value: number;
  author: string;
  dateCreated: string;
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
