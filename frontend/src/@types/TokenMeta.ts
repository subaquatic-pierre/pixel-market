export interface TokenMetaAttributes {
  [key: string]: string;
}

export interface TokenMeta {
  tokenUri: string;
  name: string;
  description: string;
  imageUrl: string;
  attributes: TokenMetaAttributes[];
}
