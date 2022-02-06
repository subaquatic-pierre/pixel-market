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

struct Admin {
    uint256 adminId;
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

contract PixelMarketplace is IERC721Receiver {
    using Counters for Counters.Counter;

    address _owner;
    PixelNFT NFTContract;
    PixelToken tokenContract;

    // Create admin list
    Counters.Counter public adminCount;
    mapping(uint256 => Admin) public admins;

    // Marketplace items
    Counters.Counter public listingIds;
    mapping(uint256 => Listing) public listings;

    // Marketplace authors
    Counters.Counter public authorCount;
    address[] public authorAddressList;
    mapping(address => Author) public authors;

    // Author listing IDs
    mapping(address => uint256[]) addressToListingIds;

    // EVENTS
    event AuthorUpdate(
        uint256 authorCount,
        address _authorWalletAddress,
        string _authorName,
        string _authorEmail,
        bool isActive
    );

    event AdminUpdate(
        uint256 adminCount,
        address walletAddress,
        bool activeStatus
    );

    event ListingCreated(address _authorId, uint256 _listingId, uint256 value);

    constructor(address _NFTContractAddress, address _tokenContractAddress) {
        _owner = msg.sender;
        NFTContract = PixelNFT(_NFTContractAddress);
        tokenContract = PixelToken(_tokenContractAddress);

        // Default author
        string memory _authorName = "Default Author";
        string memory _authorEmail = "default@email.com";

        _updateAuthor(msg.sender, _authorName, _authorEmail, true);
        createAdmin(msg.sender);
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

    function isAuthor(address _walletAddress) public view returns (bool) {
        Author memory _author = authors[_walletAddress];

        if (_author.exists == true) {
            return true;
        } else {
            return false;
        }
    }

    function requestAuthorship(
        string memory _authorName,
        string memory _authorEmail
    ) public {
        // Check if author already exists
        bool _isAuthor = isAuthor(msg.sender);
        require(!_isAuthor, "Author already exists");

        bool _setAuthorExistsInMap = true;

        _updateAuthor(
            msg.sender,
            _authorName,
            _authorEmail,
            _setAuthorExistsInMap
        );
    }

    function createAdmin(address _walletAddress) public returns (bool) {
        require(
            msg.sender == _owner,
            "Only contract owner can add or remove admins"
        );
        // Add new admin to admin mapping
        Admin memory newAdmin = Admin(
            adminCount.current(),
            _walletAddress,
            true
        );

        admins[adminCount.current()] = newAdmin;

        emit AdminUpdate(adminCount.current(), _walletAddress, true);

        adminCount.increment();

        return true;
    }

    function removeAdmin(address _walletAddress) public returns (bool) {
        Admin memory admin = _findAdmin(_walletAddress);

        if (
            admin.activeStatus == true && admin.walletAddress == _walletAddress
        ) {
            admin.activeStatus = false;
            admins[admin.adminId] = admin;
            return true;
        }

        emit AdminUpdate(adminCount.current(), _walletAddress, false);

        return false;
    }

    function _findAdmin(address _walletAddress)
        private
        view
        returns (Admin memory)
    {
        for (uint256 i = 0; i < adminCount.current(); i++) {
            Admin memory admin = admins[i];

            if (
                admin.activeStatus == true &&
                admin.walletAddress == _walletAddress
            ) {
                return admin;
            }
        }

        Admin memory blankAdmin = Admin(0, address(0), false);
        return blankAdmin;
    }

    function isAdmin() public view returns (bool) {
        Admin memory admin = _findAdmin(msg.sender);

        if (admin.activeStatus == true && admin.walletAddress != address(0)) {
            return true;
        } else {
            return false;
        }
    }

    function _updateAuthor(
        address _walletAddress,
        string memory _authorName,
        string memory _authorEmail,
        bool _isActiveStatus
    ) private {
        bool setAuthorExistsInMap = true;

        Author memory newAuthor = Author(
            _walletAddress,
            _authorName,
            _authorEmail,
            _isActiveStatus,
            setAuthorExistsInMap
        );

        authors[_walletAddress] = newAuthor;
        authorAddressList.push(_walletAddress);
        authorCount.increment();

        emit AuthorUpdate(
            authorCount.current(),
            _walletAddress,
            _authorName,
            _authorEmail,
            _isActiveStatus
        );
    }

    function _listingExists() private pure returns (bool) {
        // check listing does not exist with tokenId and is available
        return false;
    }

    function createListing(uint256 _tokenId, uint256 _value)
        public
        returns (uint256)
    {
        require(
            isAuthor(msg.sender),
            "Only registered authors can create listings"
        );

        require(
            !_listingExists(),
            "Cannot create new listing with that token ID"
        );

        // Increment token Id's

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
        listingIds.increment();

        // Add listing to author listings
        uint256[] storage authorListingIds = addressToListingIds[msg.sender];
        authorListingIds.push(_currentListingId);

        emit ListingCreated(msg.sender, _currentListingId, _value);

        return _currentListingId;
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

    function getAllListingIds() public view returns (uint256[] memory) {
        // Create array of size listing count
        uint256 _listingCount = listingIds.current();
        uint256[] memory _listingIds = new uint256[](_listingCount);

        // Build token Id array by looping over listing mapping and pushing list item Id to array
        for (uint256 i = 0; i < _listingCount; i++) {
            Listing memory item = listings[i];
            _listingIds[i] = item.id;
        }

        return _listingIds;
    }

    function removeListing(uint256 _listingId) public {
        require(
            isAuthor(msg.sender),
            "Only registered authors can remove listings"
        );

        _updateListingStatus(_listingId, ListingStatus.REMOVED);
    }

    function _setListingSold(uint256 listingId) private {
        _updateListingStatus(listingId, ListingStatus.SOLD);
    }

    function _updateListingStatus(
        uint256 listingId,
        ListingStatus _listingStatus
    ) private {
        Listing memory updateListing = listings[listingId];

        // update listing
        updateListing.status = _listingStatus;
        listings[listingId] = updateListing;
    }

    function transferToken(
        address authorAddress,
        address receiverAddress,
        uint256 listingId,
        uint256 tokenId,
        uint256 tokenValue
    ) public payable returns (bool) {
        // Get 10% of item value, send to owner of marketplace for commission
        uint256 ownerCommission = ((tokenValue * 10) / 100);
        uint256 authorShare = tokenValue - ownerCommission;

        // Transfer to marketplace owner / contract owner
        tokenContract.transferFrom(receiverAddress, _owner, ownerCommission);

        // Transfer to tokens to author of listing
        tokenContract.transferFrom(receiverAddress, authorAddress, authorShare);

        // Transfer NFT token to the caller
        NFTContract.safeTransferFrom(authorAddress, receiverAddress, tokenId);

        _setListingSold(listingId);

        return true;
    }
}

// TODO:
// - Need to improve listing count logic, listing should be deleted from mapping and
//   token count should be updated. This improves effeciency in returning an array which
//   will conintue growing even though items have been removed from marketplace

// - Limit token creation time to avoid duplicate URI on token creation

// - Window reload on account change
