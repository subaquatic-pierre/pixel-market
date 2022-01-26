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
    SOLD,
    REMOVED
}

struct Listing {
    uint256 id;
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

    // Author listing IDs
    mapping(address => uint256[]) addressToListingIds;

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

        _updateAuthor(_authorId, msg.sender, _authorName, _authorEmail, true);
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

        _updateAuthor(
            authorIds.current(),
            msg.sender,
            _authorName,
            _authorEmail,
            _setAuthorExistsInMap
        );
    }

    function _updateAuthor(
        uint256 _authorId,
        address _authorWalletAddress,
        string memory _authorName,
        string memory _authorEmail,
        bool _isActiveStatus
    ) private {
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

    function createListing(uint256 _tokenId, uint256 _value)
        public
        returns (uint256)
    {
        require(isAuthor(), "Only registered authors can create listings");

        // Increment token Id's
        listingIds.increment();

        // Get latest Id for new token after increment
        uint256 _currentListingId = listingIds.current();

        // Create item in memory
        Listing memory listing = Listing(
            _currentListingId,
            msg.sender,
            _tokenId,
            _value,
            ListingStatus.AVAILABLE
        );

        // Add item to listings mapping
        listings[_currentListingId] = listing;

        // Add listing to author listings
        uint256[] storage authorListingIds = addressToListingIds[msg.sender];
        authorListingIds.push(_currentListingId);

        emit ListingCreated(msg.sender, _currentListingId, _value);

        return _currentListingId;
    }

    function removeListing(uint256 _listingId) public {
        require(isAuthor(), "Only registered authors can remove listings");

        Listing memory listing = listings[_listingId];
        listing.status = ListingStatus.REMOVED;
        listings[_listingId] = listing;
    }

    function getAllAvailableListingIds()
        public
        view
        returns (uint256[] memory)
    {
        // Create array of size listing count
        uint256 _listingCount = listingIds.current();
        uint256[] memory _listingIds = new uint256[](_listingCount + 1);

        // Build token Id array by looping over listing mapping and pushing list item Id to array
        for (uint256 i = 1; i <= _listingCount; i++) {
            Listing memory item = listings[i];
            if (item.status == ListingStatus.AVAILABLE) {
                _listingIds[i] = item.id;
            }
        }

        return _listingIds;
    }

    function listingIdToTokenId(uint256 listingId)
        public
        view
        returns (uint256)
    {
        Listing memory listing = listings[listingId];
        return listing.tokenId;
    }

    function getMyListingsIds() public view returns (uint256[] memory) {
        return addressToListingIds[msg.sender];
    }

    function _setListingSold() private {}

    function transferToken(
        address authorAddress,
        address receiverAddress,
        // uint256 listingId,
        uint256 tokenId,
        uint256 tokenValue
    ) public payable returns (bool) {
        // Get 10% of item value, send to owner of marketplace for commission
        uint256 ownerCommission = (tokenValue * 10) / 100;
        uint256 authorShare = tokenValue - ownerCommission;

        // Transfer to marketplace owner / contract owner
        tokenContract.transferFrom(receiverAddress, _owner, ownerCommission);

        // Transfer to tokens to author of listing
        tokenContract.transferFrom(receiverAddress, authorAddress, authorShare);

        // Transfer NFT token to the caller
        NFTContract.safeTransferFrom(authorAddress, receiverAddress, tokenId);
        return true;
    }
}

// TODO:
// - Need to improve listing count logic, listing should be deleted from mapping and
//   token count should be updated. This improves effeciency in returning an array which
//   will conintue growing even though items have been removed from marketplace

// - Limit token creation time to avoid duplicate URI on token creation

// - Window reload on account change
