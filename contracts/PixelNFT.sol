// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PixelNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct TokenMeta {
        bytes32 authorName;
        bytes32 url;
        bytes32 name;
        bytes32 description;
        bytes32 tokenPrice;
        bytes32 dateCreated;
    }

    mapping(uint256 => TokenMeta) public tokenMeta;

    constructor() ERC721("PixelNFT", "PIXNFT") {}

    function createListing(
        address author,
        bytes32 authorName,
        bytes32 url,
        bytes32 name,
        bytes32 description,
        bytes32 tokenPrice,
        bytes32 dateCreated
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(author, newItemId);

        // Create token meta
        TokenMeta memory meta = TokenMeta(
            authorName,
            url,
            name,
            description,
            tokenPrice,
            dateCreated
        );

        tokenMeta[newItemId] = meta;

        return newItemId;
    }
}
