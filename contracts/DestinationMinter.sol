// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {GHONFT} from "./GHONFT.sol";


contract DestinationMinter is CCIPReceiver {
    GHONFT nft;

    event MintCallSuccessfull();

    constructor(address router, address nftAddress) CCIPReceiver(router) {
        nft = GHONFT(nftAddress);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(nft).call(message.data);
        require(success);
        emit MintCallSuccessfull();
    }
}