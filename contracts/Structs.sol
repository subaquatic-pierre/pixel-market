// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct User {
    uint256 id;
    address walletAddress;
    string name;
    string email;
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
    NONE,
    AVAILABLE,
    SOLD,
    REMOVED
}

enum ActiveStatus {
    NONE,
    ACTIVE,
    INACTIVE
}
