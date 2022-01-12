// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./PixelNFT.sol";

abstract contract PixelMarketplace is IERC721Receiver {
    struct Author {
        string authorName;
        string authorEmail;
        bool isActive;
    }

    struct AuthorRequest {
        address authorWalletAddress;
        string authorName;
        string authorEmail;
        bool processed;
    }

    event AuthorshipRequested(
        address _authorWalletAddress,
        string _authorName,
        string _authorEmail
    );

    event AuthorStatusUpdate(
        address _authorWalletAddress,
        string _authorName,
        string _authorEmail,
        bool isActive
    );

    address _owner;

    // Marketplace items
    uint256 public marketplaceItemCount;
    mapping(address => PixelNFT) public marketplaceItems;

    // Marketplace authors
    uint256 public authorCount;
    mapping(address => Author) public authors;

    // Author requests
    AuthorRequest[] authorRequests;

    constructor() {
        _owner = msg.sender;
    }

    function requestAuthorship(
        string memory _authorName,
        string memory _authorEmail
    ) public {
        authorRequests.push(
            AuthorRequest(msg.sender, _authorName, _authorEmail, false)
        );
        emit AuthorshipRequested(msg.sender, _authorName, _authorEmail);
    }

    function setAuthorStatus(
        address _authorWalletAddress,
        string memory _authorName,
        string memory _authorEmail,
        bool _isActiveStatus
    ) public {
        require(
            msg.sender == _owner,
            "Only contract owner has the right to create set Author Status"
        );

        Author memory newAuthor = Author(
            _authorName,
            _authorEmail,
            _isActiveStatus
        );
        authors[_authorWalletAddress] = newAuthor;
        emit AuthorStatusUpdate(
            _authorWalletAddress,
            _authorName,
            _authorEmail,
            _isActiveStatus
        );
    }
}
