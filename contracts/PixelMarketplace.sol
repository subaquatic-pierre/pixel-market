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
    mapping(address => User) public users;
    address[] public userAddressList;

    // Marketplace items
    Counters.Counter public listingCount;
    mapping(uint256 => Listing) public listings;
    mapping(address => uint256[]) public userAddressToListingIds;

    // EVENTS
    event UserUpdated(
        uint256 id,
        address walletAddress,
        string name,
        string email,
        ActiveStatus adminStatus,
        ActiveStatus authorStatus
    );

    event ListingUpdated(
        uint256 id,
        uint256 authorId,
        uint256 tokenId,
        uint256 value,
        ListingStatus listingStatus
    );

    constructor(address _NFTContractAddress, address _tokenContractAddress) {
        _owner = msg.sender;
        NFTContract = PixelNFT(_NFTContractAddress);
        tokenContract = PixelToken(_tokenContractAddress);

        // Default author
        string memory _name = "Default User";
        string memory _email = "default@email.com";

        createAdmin(msg.sender, _name, _email);
    }

    function _userExists(address _walletAddress) private view returns (bool) {
        User storage user = users[_walletAddress];
        return user.walletAddress != address(0);
    }

    function _availableListingExists(uint256 _listingId, bool _exists)
        private
        pure
        returns (bool)
    {
        // TODO: Implement check if listing exists
        // _exists varaible is only used for dummy purpose, must be removed

        return _exists;
    }

    function _availableListingExistsWithTokenId(uint256 _tokenId, bool _exists)
        private
        pure
        returns (bool)
    {
        // TODO: Implement check if available listing exists with tokenId
        // _exists varaible is only used for dummy purpose, must be removed

        return _exists;
    }

    function _isAdmin(address _walletAddress) private view returns (bool) {
        User storage user = users[_walletAddress];

        if (
            user.adminStatus == ActiveStatus.ACTIVE &&
            user.walletAddress != address(0)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function _isAuthor(address _walletAddress) private view returns (bool) {
        User storage user = users[_walletAddress];

        if (
            user.authorStatus == ActiveStatus.ACTIVE &&
            user.walletAddress != address(0)
        ) {
            return true;
        } else {
            return false;
        }
    }

    function _createUser(
        address _walletAddress,
        string memory _name,
        string memory _email,
        ActiveStatus _adminStatus,
        ActiveStatus _authorStatus
    ) private returns (User storage) {
        uint256 _userId = userAddressList.length;

        User memory _newUser = User(
            _userId,
            _walletAddress,
            _name,
            _email,
            _adminStatus,
            _authorStatus
        );

        users[_walletAddress] = _newUser;
        userAddressList.push(_walletAddress);

        emit UserUpdated(
            _userId,
            _walletAddress,
            _name,
            _email,
            _adminStatus,
            _authorStatus
        );

        return users[_walletAddress];
    }

    function createAdmin(
        address _walletAddress,
        string memory _adminName,
        string memory _adminEmail
    ) public returns (User memory) {
        require(msg.sender == _owner, "Only contract owner can create admins");

        require(!_isAdmin(_walletAddress), "User is already an admin");

        User storage user = _createUser(
            _walletAddress,
            _adminName,
            _adminEmail,
            ActiveStatus.ACTIVE,
            ActiveStatus.ACTIVE
        );

        return user;
    }

    function removeAdmin(address _walletAddress) public {
        require(
            _userExists(_walletAddress),
            "User with that address does not exist"
        );

        require(_isAdmin(_walletAddress), "User it not an admin");

        User storage _user = users[_walletAddress];
        _user.adminStatus = ActiveStatus.INACTIVE;

        emit UserUpdated(
            _user.id,
            _user.walletAddress,
            _user.name,
            _user.email,
            _user.adminStatus,
            _user.authorStatus
        );
    }

    function isAdmin() public view returns (bool) {
        bool result = _isAdmin(msg.sender);
        return result;
    }

    function isAuthor() public view returns (bool) {
        bool result = _isAuthor(msg.sender);
        return result;
    }

    function createAuthor(
        address _walletAddress,
        string memory _name,
        string memory _email
    ) public {
        // Check if author already exists
        require(!_isAuthor(msg.sender), "Author already exists");

        ActiveStatus _authorStatus = ActiveStatus.ACTIVE;
        ActiveStatus _adminStatus = ActiveStatus.NONE;

        _createUser(_walletAddress, _name, _email, _adminStatus, _authorStatus);
    }

    function removeAuthor(address _walletAddress) public {
        require(
            _userExists(_walletAddress),
            "User with that address does not exist"
        );

        require(_isAuthor(_walletAddress), "User is not an author");

        User storage _user = users[_walletAddress];
        _user.authorStatus = ActiveStatus.INACTIVE;

        emit UserUpdated(
            _user.id,
            _user.walletAddress,
            _user.name,
            _user.email,
            _user.adminStatus,
            _user.authorStatus
        );
    }

    function createListing(uint256 _tokenId, uint256 _value) public {
        require(_isAuthor(msg.sender), "Only authors can create listings");

        User storage _user = users[msg.sender];

        require(
            !_availableListingExistsWithTokenId(_tokenId, false),
            "Cannot create new listing with that token ID"
        );

        // Get latest Id for new token after increment
        uint256 _listingId = listingCount.current();

        // Create item in memory
        Listing memory _listing = Listing(
            _listingId,
            _tokenId,
            _value,
            _user,
            ListingStatus.AVAILABLE
        );

        // Add listing id to user lisingId list
        uint256[] storage userListingIds = userAddressToListingIds[msg.sender];
        userListingIds.push(_listing.id);

        // Add item to listings mapping
        listings[_listingId] = _listing;

        emit ListingUpdated(
            _listing.id,
            _tokenId,
            _listing.author.id,
            _listing.value,
            _listing.status
        );

        listingCount.increment();
    }

    function listingIdToTokenId(uint256 _listingId)
        public
        view
        returns (uint256)
    {
        require(
            _availableListingExists(_listingId, true),
            "Listing with that ID does not exist"
        );
        Listing memory listing = listings[_listingId];
        return listing.tokenId;
    }

    function getMyListingsIds() public view returns (uint256[] memory) {
        uint256[] storage listingIds = userAddressToListingIds[msg.sender];
        return listingIds;
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
            _isAuthor(msg.sender),
            "Only registered users can remove listings"
        );

        // TODO: Ensure listing exists
        // TODO: Ensure msg.sender owns listing if not admin

        _updateListing(_listingId, ListingStatus.REMOVED);
    }

    function removeListings(uint256[] memory _listingIds) public {
        require(
            _isAdmin(msg.sender),
            "Only registered users can remove listings"
        );

        for (uint256 i = 0; i < _listingIds.length; i++) {
            uint256 _listingId = _listingIds[i];

            require(
                _availableListingExists(_listingId, true),
                "Listing with that ID is not marked as available"
            );

            _updateListing(_listingId, ListingStatus.REMOVED);
        }
    }

    function _updateListing(uint256 _listingId, ListingStatus _listingStatus)
        private
    {
        Listing storage _listing = listings[_listingId];
        _listing.status = _listingStatus;

        emit ListingUpdated(
            _listing.id,
            _listing.author.id,
            _listing.tokenId,
            _listing.value,
            _listing.status
        );
    }

    function transferToken(
        address _authorAddress,
        address _receiverAddress,
        uint256 _listingId,
        uint256 _tokenId,
        uint256 _tokenValue
    ) public payable {
        // Get 10% of item value, send to owner of marketplace for commission
        uint256 _ownerCommission = ((_tokenValue * 10) / 100);
        uint256 _authorShare = _tokenValue - _ownerCommission;

        // Transfer to marketplace owner / contract owner
        tokenContract.transferFrom(_receiverAddress, _owner, _ownerCommission);

        // Transfer to tokens to author of listing
        tokenContract.transferFrom(
            _receiverAddress,
            _authorAddress,
            _authorShare
        );

        // Transfer NFT token to the caller
        NFTContract.safeTransferFrom(
            _authorAddress,
            _receiverAddress,
            _tokenId
        );

        _updateListing(_listingId, ListingStatus.SOLD);
    }

    function userAddresses() public view returns (address[] memory) {
        uint256 _userCount = userCount();
        address[] memory addressList = new address[](_userCount);
        for (uint256 i = 0; i < _userCount; i++) {
            addressList[i] = userAddressList[i];
        }

        return addressList;
    }

    function name() public pure returns (string memory) {
        return "PixelMarketplace";
    }

    function userCount() public view returns (uint256) {
        return userAddressList.length;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {}

    function owner() public view returns (address) {
        return _owner;
    }
}

// TODO:
// - Need to improve listing count logic, listing should be deleted from mapping and
//   token count should be updated. This improves effeciency in returning an array which
//   will conintue growing even though items have been removed from marketplace

// - Limit token creation time to avoid duplicate URI on token creation

// - Window reload on account change
