// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Sneaker Authenticity Registry
 * @dev A simplified blockchain registry for sneaker authenticity.
 */
contract SneakerRegistry {

    // Data structure to store sneaker information
    struct Sneaker {
        uint256 tokenId;          // Unique ID for each sneaker
        string serialNumber;      // Unique serial number from manufacturer
        address currentOwner;     // Current owner of the sneaker
    }

    // Maps tokenId to Sneaker struct
    mapping(uint256 => Sneaker) public sneakers;
    // Prevents duplicate serial numbers
    mapping(string => bool) private serialUsed;

    uint256 public nextTokenId;
    // Address allowed to mint new sneakers
    address public manufacturer;

    // Events for blockchain logs
    event SneakerMinted(uint256 indexed tokenId, string serialNumber, address indexed owner);
    event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to);

    /**
     * @dev Initializes manufacturer as the contract deployer
     */
    constructor() {
        manufacturer = msg.sender;
    }

    /**
     * @dev Restricts function access to manufacturer only
     */
    modifier onlyManufacturer() {
        require(msg.sender == manufacturer, "Only manufacturer can perform this action");
        _;
    }

    /**
     * @notice Mints a new sneaker with a unique serial number
     * @param serialNumber The manufacturer-assigned unique serial number
     */
    function mintSneaker(string memory serialNumber) public onlyManufacturer {
        require(!serialUsed[serialNumber], "Serial number already used");
        
        sneakers[nextTokenId] = Sneaker(nextTokenId, serialNumber, msg.sender);
        serialUsed[serialNumber] = true;

        emit SneakerMinted(nextTokenId, serialNumber, msg.sender);
        nextTokenId++;
    }

    /**
     * @notice Transfers sneaker ownership to another address
     * @param tokenId The unique sneaker ID
     * @param newOwner Address of the new owner
     */
    function transferOwnership(uint256 tokenId, address newOwner) public {
        require(msg.sender == sneakers[tokenId].currentOwner, "Caller is not the owner");
        require(newOwner != address(0), "Invalid new owner");

        address previousOwner = sneakers[tokenId].currentOwner;
        sneakers[tokenId].currentOwner = newOwner;

        emit OwnershipTransferred(tokenId, previousOwner, newOwner);
    }

    /**
     * @notice Verifies sneaker authenticity by serial number
     * @param serialNumber The sneaker's serial number
     * @return tokenId The unique ID of the sneaker
     * @return owner The address of the current owner
     */
     
    function verifySneaker(string memory serialNumber) public view returns (uint256 tokenId, address owner) {
        for (uint256 i = 0; i < nextTokenId; i++) {
            if (keccak256(bytes(sneakers[i].serialNumber)) == keccak256(bytes(serialNumber))) {
                return (sneakers[i].tokenId, sneakers[i].currentOwner);
            }
        }
        revert("Sneaker not found");
    }
}
