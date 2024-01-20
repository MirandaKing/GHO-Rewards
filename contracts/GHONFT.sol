// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract GHONFT is ERC721URIStorage {
    string constant TOKEN_URI =
        "https://ipfs.io/ipfs/QmfMJcTUi957eBsesERyRBDmoXqd1cE3MvGiRk4NC1X48H?filename=image.png";
    uint256 internal tokenId;

    constructor() ERC721("GHONFT", "GNFT") {
    }

    function mint(address to) public  {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, TOKEN_URI);
        unchecked {
            tokenId++;
        }
    }
}