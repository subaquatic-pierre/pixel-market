// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct Author {
    uint256 id;
    address authorWallet;
    string authorName;
    string authorEmail;
    bool isActive;
    bool exists;
}

struct Admin {
    uint256 id;
    string name;
    string email;
    address walletAddress;
    bool activeStatus;
}

struct Listing {
    uint256 id;
    address author;
    uint256 tokenId;
    uint256 value;
    ListingStatus status;
}

enum ListingStatus {
    AVAILABLE,
    SOLD,
    REMOVED
}
