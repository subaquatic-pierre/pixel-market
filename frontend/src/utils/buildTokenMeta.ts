// import { TokenMeta, TokenMetaAttributes } from "@types/TokenMeta";
import fs from "fs";

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

const PUBLIC_DIR = __dirname + "/../public";
const IMAGE_DIR = `${PUBLIC_DIR}/images`;
const META_DIR = `${PUBLIC_DIR}/meta`;
const BASE_URL = "http://localhost:3000";
const IMAGE_URL = `${BASE_URL}/images`;
const META_URL = `${BASE_URL}/meta`;

export const buildMetaUrl = (tokenId: string) => {
  const tokenUrl = `${META_URL}/token-${tokenId}.json`;
  return tokenUrl;
};

export const buildImageUrl = (tokenId: string) => {
  const imageUrl = `${IMAGE_URL}/token-id-${tokenId}.jpeg`;
  return imageUrl;
};

export const buildTokenMeta = (
  tokenId: string,
  name: string,
  description: string,
  attrs: TokenMetaAttributes[]
): TokenMeta => {
  const tokenMetaJson = {
    name: name,
    description: description,
    imageUrl: buildImageUrl(tokenId),
    attributes: attrs,
  };

  return tokenMetaJson;
};

export const saveTokenMeta = (tokenMeta: TokenMeta): void => {
  if (!fs.existsSync(META_DIR)) {
    fs.mkdirSync(META_DIR);
  }
};

export const saveTokenImage = (tokenId: string): void => {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR);
  }

  const imagePath = `${IMAGE_DIR}/token-id-${tokenId}.jpeg`;

  //   fs.writeFileSync(imagePath, JSON.stringify(ContractArtifact, null, 2));
};
