// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GHORewards {
    event GHOTransferred(address indexed from, address indexed to, uint256 amount);

    function transferGHOToken(
        IERC20 tokenAddress,
        address payable recipient,
        uint256 value
    ) external {
        IERC20 token = IERC20(tokenAddress);

        require(token.transferFrom(msg.sender, recipient, value), "GHO transfer failed");

        // Emit event
        emit GHOTransferred(msg.sender, recipient, value);
    }
}