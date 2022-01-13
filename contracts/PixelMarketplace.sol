// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./PixelNFT.sol";
import "./PixelToken.sol";

struct Author {
    address authorWallet;
    string authorName;
    string authorEmail;
    bool isActive;
    bool exists;
}

enum ListingStatus {
    AVAILABLE,
    SOLD
}

struct Listing {
    address author;
    uint256 tokenId;
    uint256 value;
    ListingStatus status;
}

contract PixelMarketplace is IERC721Receiver {
    using Counters for Counters.Counter;

    address _owner;
    PixelNFT NFTContract;
    PixelToken tokenContract;

    // Marketplace items
    Counters.Counter public listingIds;
    mapping(uint256 => Listing) public listings;

    // Marketplace authors
    Counters.Counter public authorIds;
    mapping(uint256 => Author) public authors;

    event AuthorUpdate(
        uint256 _authorId,
        address _authorWalletAddress,
        string _authorName,
        string _authorEmail,
        bool isActive
    );

    event ListingCreated(address _authorId, uint256 _listingId, uint256 value);

    constructor(address _NFTContractAddress, address _tokenContractAddress) {
        _owner = msg.sender;
        NFTContract = PixelNFT(_NFTContractAddress);
        tokenContract = PixelToken(_tokenContractAddress);

        // Create default author on contract create
        authorIds.increment();

        // Default author
        uint256 _authorId = authorIds.current();
        string memory _authorName = "Default Author";
        string memory _authorEmail = "default@email.com";

        updateAuthors(_authorId, msg.sender, _authorName, _authorEmail, true);
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

    function createListing(uint256 _tokenId, uint256 _value)
        public
        returns (uint256)
    {
        require(isAuthor(), "Only registered authors can create listings");
        //         address author;
        // uint256 tokenId;
        // uint256 value;
        // ListingStatus status;
        listingIds.increment();
        uint256 _currentListingId = listingIds.current();
        Listing memory item = Listing(
            msg.sender,
            _tokenId,
            _value,
            ListingStatus.AVAILABLE
        );
        listings[_currentListingId] = item;

        emit ListingCreated(msg.sender, _currentListingId, _value);

        // Set contract as aprover for token
        address _contractAddress = address(this);
        NFTContract.approve(_contractAddress, _tokenId);

        return _currentListingId;
    }

    function addresstoAuthorId(address _authorAddress)
        public
        view
        returns (uint256)
    {
        uint256 _authorId = 0;
        for (uint256 i = 1; i <= authorIds.current(); i++) {
            Author memory author = authors[i];
            if (author.authorWallet == _authorAddress) {
                _authorId = i;
                break;
            }
        }

        return _authorId;
    }

    function getMyId() public view returns (uint256) {
        uint256 _authorId = addresstoAuthorId(msg.sender);
        return _authorId;
    }

    function requestAuthorship(
        string memory _authorName,
        string memory _authorEmail
    ) public {
        // Check if author already exists
        bool _isAuthor = isAuthor();
        require(!_isAuthor, "Author already exists");

        bool _setAuthorExistsInMap = true;
        authorIds.increment();

        updateAuthors(
            authorIds.current(),
            msg.sender,
            _authorName,
            _authorEmail,
            _setAuthorExistsInMap
        );
    }

    function updateAuthors(
        uint256 _authorId,
        address _authorWalletAddress,
        string memory _authorName,
        string memory _authorEmail,
        bool _isActiveStatus
    ) public {
        bool setAuthorExistsInMap = true;

        Author memory newAuthor = Author(
            _authorWalletAddress,
            _authorName,
            _authorEmail,
            _isActiveStatus,
            setAuthorExistsInMap
        );

        authors[_authorId] = newAuthor;

        emit AuthorUpdate(
            _authorId,
            _authorWalletAddress,
            _authorName,
            _authorEmail,
            _isActiveStatus
        );
    }

    function isAdmin() public view returns (bool) {
        return msg.sender == _owner;
    }

    function isAuthor() public view returns (bool) {
        uint256 _authorId = addresstoAuthorId(msg.sender);

        if (_authorId == 0) {
            return false;
        } else {
            return true;
        }
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
