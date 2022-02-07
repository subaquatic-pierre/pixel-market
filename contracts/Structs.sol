// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct User {
    uint256 id;
    address walletAddress;
    string name;
    string email;
    Listing[] listings;
    ActiveStatus adminStatus;
    ActiveStatus authorStatus;
}

struct Listing {
    uint256 id;
    uint256 tokenId;
    uint256 value;
    User author;
    ListingStatus status;
}

enum ListingStatus {
    AVAILABLE,
    SOLD,
    REMOVED
}

enum ActiveStatus {
    ACTIVE,
    INACTIVE,
    NONE
}
