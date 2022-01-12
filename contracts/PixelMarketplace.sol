// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./PixelNFT.sol";
import "./PixelToken.sol";

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

contract PixelMarketplace is IERC721Receiver {
    address _owner;
    PixelNFT NFTContract;
    PixelToken tokenContract;

    // Marketplace items
    uint256 public marketplaceItemCount;
    mapping(uint256 => PixelNFT) public marketplaceItems;

    // Marketplace authors
    uint256 public authorCount;
    mapping(address => Author) public authors;

    // Author requests
    AuthorRequest[] authorRequests;

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

    constructor(address _NFTContractAddress, address _tokenContractAddress) {
        _owner = msg.sender;
        NFTContract = PixelNFT(_NFTContractAddress);
        tokenContract = PixelToken(_tokenContractAddress);
    }

    function name() public pure returns (string memory) {
        return "PixelMarketplace";
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {}

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

    // function getAuthorListings(address _authorAddress)
    //     public
    //     pure
    //     returns (uint256[] memory)
    // {
    //     uint256[] memory a = new uint256[](5);
    //     // uint256[] memory tokenIds = new [1, 2];
    //     return a;
    // }
}
