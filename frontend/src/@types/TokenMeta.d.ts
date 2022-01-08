export interface TokenMetaAttributes {
  key: string;
  value: string;
}

export interface TokenMeta {
  name: string;
  description: string;
  imageUrl: string;
  attributes: TokenMetaAttributes[];
}
