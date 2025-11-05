// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// Sneaker Authenticity Registry
/// ~ Enables manufacturers to mint NFTs representing sneaker authenticity and track ownership
contract SneakerRegistry {
    struct Sneaker {
        uint256 tokenId;
        string serialNumber;
        address currentOwner;
    }

    mapping(uint256 => Sneaker) public sneakers;
    uint256 public nextTokenId;
    address public manufacturer;

    constructor() {
        manufacturer = msg.sender;
    }

    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Not authorized");
        _;
    }

    /// Mint a new sneaker NFT
    function mintSneaker(string memory serialNumber) public onlyManufacturer {
        sneakers[nextTokenId] = Sneaker(nextTokenId, serialNumber, msg.sender);
        nextTokenId++;
    }

    /// Transfer sneaker ownership
    function transferOwnership(uint256 tokenId, address newOwner) public {
        require(msg.sender == sneakers[tokenId].currentOwner, "Not owner");
        sneakers[tokenId].currentOwner = newOwner;
    }
}
