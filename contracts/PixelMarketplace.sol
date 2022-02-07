// contracts/PixelToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Structs.sol";
import "./PixelNFT.sol";
import "./PixelToken.sol";

contract PixelMarketplace is IERC721Receiver {
    using Counters for Counters.Counter;

    address _owner;
    PixelNFT NFTContract;
    PixelToken tokenContract;

    // Create user list
    Counters.Counter public adminCount;
    Counters.Counter public userCount;
    mapping(uint256 => User) public users;

    // Marketplace items
    Counters.Counter public listingCount;
    mapping(uint256 => Listing) public listings;

    // EVENTS
    event AuthorUpdate(
        uint256 id,
        address walletAddress,
        string name,
        string email,
        ActiveStatus
    );

    event AdminUpdate(
        uint256 id,
        address walletAddress,
        string name,
        string email,
        ActiveStatus
    );

    event ListingCreated(address _authorId, uint256 _listingId, uint256 value);

    constructor(address _NFTContractAddress, address _tokenContractAddress) {
        _owner = msg.sender;
        NFTContract = PixelNFT(_NFTContractAddress);
        tokenContract = PixelToken(_tokenContractAddress);

        // Default author
        string memory _name = "Default Author";
        string memory _email = "default@email.com";

        // Create blank admin and blank author
        createBlankMapEntries();

        createAuthor(msg.sender, _name, _email);
        createAdmin(msg.sender, _name, _email);
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

    function createBlankMapEntries() private {
        uint256 adminId = adminCount.current();

        // Create blank admin at position 0
        Admin memory newAdmin = Admin(
            adminId,
            walletAddress,
            adminName,
            adminEmail,
            ActiveStatus.ACTIVE
        );

        admins[adminId] = newAdmin;
        adminCount.increment();

        // Create blank author at position 0

        uint256 authorId = authorCount.current();

        Admin memory newAuthor = Author(
            authorCount,
            walletAddress,
            adminName,
            adminEmail,
            [],
            ActiveStatus.ACTIVE
        );

        authors[adminId] = newAdmin;
        authorCount.increment();
    }

    function createAdmin(
        address walletAddress,
        string memory adminName,
        string memory adminEmail
    ) public returns (bool) {
        require(
            msg.sender == _owner,
            "Only contract owner can add or remove admins"
        );

        uint256 adminId = adminCount.current();
        // Add new admin to admin mapping
        Admin memory newAdmin = Admin(
            adminId,
            walletAddress,
            adminName,
            adminEmail,
            ActiveStatus.ACTIVE
        );

        admins[adminId] = newAdmin;

        emit AdminUpdate(
            adminId,
            walletAddress,
            adminName,
            adminEmail,
            ActiveStatus.ACTIVE
        );

        adminCount.increment();

        return true;
    }

    function removeAdmin(address walletAddress) public returns (bool) {
        Admin memory admin = _findAdmin(walletAddress);

        if (
            admin.activeStatus == ActiveStatus.ACTIVE &&
            admin.walletAddress == walletAddress
        ) {
            admin.activeStatus = ActiveStatus.INACTIVE;
            admins[admin.id] = admin;
            return true;
        }

        emit AdminUpdate(
            admin.id,
            walletAddress,
            admin.name,
            admin.email,
            ActiveStatus.INACTIVE
        );

        return false;
    }

    function _findAdmin(address walletAddress)
        private
        view
        returns (Admin memory)
    {
        for (uint256 i = 0; i < adminCount.current(); i++) {
            Admin memory admin = admins[i];

            if (admin.walletAddress == walletAddress) {
                return admin;
            }
        }

        Admin memory blankAdmin = Admin(
            0,
            address(0),
            "",
            "",
            ActiveStatus.INACTIVE
        );
        return blankAdmin;
    }

    function _isAdmin(address walletAddress) private view returns (bool) {
        Admin memory admin = _findAdmin(walletAddress);

        if (admin.activeStatus == ActiveStatus.ACTIVE) {
            return true;
        } else {
            return false;
        }
    }

    function isAdmin() public view returns (bool) {
        bool result = _isAdmin(msg.sender);
        return result;
    }

    function isAuthor(address walletAddress) public view returns (bool) {
        Author memory _author = _findAuthor(walletAddress);

        if (_author.activeStatus == ActiveStatus.ACTIVE) {
            return true;
        } else {
            return false;
        }
    }

    function requestAuthorship(string memory _name, string memory _email)
        public
    {
        // Check if author already exists
        bool _isAuthor = isAuthor(msg.sender);
        require(!_isAuthor, "Author already exists");

        createAuthor(msg.sender, _name, _email);
    }

    function _findAuthor(address walletAddress)
        private
        view
        returns (Author storage)
    {
        for (uint256 i = 0; i < adminCount.current(); i++) {
            Author storage author = authors[i];

            if (author.walletAddress == walletAddress) {
                return author;
            }
        }

        Author storage blankAuthor = authors[0];
        return blankAuthor;
    }

    function createAuthor(
        address walletAddress,
        string memory _name,
        string memory email
    ) private {
        uint256 authorId = authorCount.current();

        Author memory newAuthor = Author(
            authorId,
            walletAddress,
            _name,
            email,
            ActiveStatus.ACTIVE
        );

        authors[authorId] = newAuthor;

        emit AuthorUpdate(
            authorId,
            walletAddress,
            _name,
            email,
            ActiveStatus.ACTIVE
        );

        authorCount.increment();
    }

    function _listingExists() private pure returns (bool) {
        // check listing does not exist with tokenId and is available
        return false;
    }

    function createListing(uint256 _tokenId, uint256 _value)
        public
        returns (uint256)
    {
        Author storage author = _findAuthor(msg.sender);

        require(
            author.activeStatus == ActiveStatus.ACTIVE,
            "Only registered authors can create listings"
        );

        require(
            !_listingExists(),
            "Cannot create new listing with that token ID"
        );

        // Increment token Id's

        // Get latest Id for new token after increment
        uint256 _currentListingId = listingCount.current();

        // Create item in memory
        Listing memory listing = Listing(
            _currentListingId,
            _tokenId,
            _value,
            author,
            ListingStatus.AVAILABLE
        );

        author.listings.push(listing);

        // Add item to listings mapping
        listings[_currentListingId] = listing;

        emit ListingCreated(msg.sender, _currentListingId, _value);

        listingCount.increment();

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
        uint256 _listingCount = listingCount.current();
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

    function removeListings(uint256[] memory _listingIds) public {
        require(
            _isAdmin(msg.sender),
            "Only registered admins can remove listings"
        );

        for (uint256 i = 0; i < _listingIds.length; i++) {
            removeListing(_listingIds[i]);
        }
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
