// contracts/Token.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PixelToken is ERC20 {
    address private _owner;

    constructor() ERC20("PixelToken", "PIX") {
        _mint(msg.sender, 10000);
        _owner = msg.sender;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
}
