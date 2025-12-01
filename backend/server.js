const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS Configuration - ADD THIS BEFORE OTHER MIDDLEWARE
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add these headers manually as backup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(express.json());

// Contract ABI (from your Solidity contract)
const CONTRACT_ABI = [
  "function mintSneaker(string memory serialNumber) public",
  "function transferOwnership(uint256 tokenId, address newOwner) public",
  "function verifySneaker(string memory serialNumber) public view returns (uint256 tokenId, address owner)",
  "function sneakers(uint256) public view returns (uint256 tokenId, string serialNumber, address currentOwner)",
  "function manufacturer() public view returns (address)",
  "function nextTokenId() public view returns (uint256)",
  "event SneakerMinted(uint256 indexed tokenId, string serialNumber, address indexed owner)",
  "event OwnershipTransferred(uint256 indexed tokenId, address indexed from, address indexed to)"
];

// Setup provider and wallet
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Read-only contract for queries (no gas needed)
const readOnlyContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  CONTRACT_ABI,
  provider
);

// ==================== API ENDPOINTS ====================

// 1. Get wallet/manufacturer address
app.get('/api/wallet-address', async (req, res) => {
  try {
    const address = wallet.address;
    const manufacturerAddress = await contract.manufacturer();
    res.json({
      success: true,
      address,
      isManufacturer: address.toLowerCase() === manufacturerAddress.toLowerCase()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Mint a new sneaker (manufacturer only)
app.post('/api/mint', async (req, res) => {
  try {
    const { serialNumber } = req.body;

    if (!serialNumber) {
      return res.status(400).json({ success: false, error: 'Serial number is required' });
    }

    console.log(`Minting sneaker with serial: ${serialNumber}`);

    const tx = await contract.mintSneaker(serialNumber);
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    // Get the token ID from the event
    const event = receipt.logs.find(log => {
      try {
        return contract.interface.parseLog(log).name === 'SneakerMinted';
      } catch (e) {
        return false;
      }
    });

    let tokenId;
    if (event) {
      const parsedEvent = contract.interface.parseLog(event);
      tokenId = parsedEvent.args.tokenId.toString();
    }

    res.json({
      success: true,
      transactionHash: tx.hash,
      tokenId,
      serialNumber,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    console.error('Mint error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Verify a sneaker by serial number (read-only)
app.get('/api/verify/:serialNumber', async (req, res) => {
  try {
    const { serialNumber } = req.params;

    console.log(`Verifying sneaker: ${serialNumber}`);

    const result = await readOnlyContract.verifySneaker(serialNumber);

    res.json({
      success: true,
      tokenId: result.tokenId.toString(),
      owner: result.owner,
      serialNumber
    });
  } catch (error) {
    console.error('Verify error:', error);
    res.status(404).json({
      success: false,
      error: 'Sneaker not found',
      message: error.message
    });
  }
});

// 4. Get sneaker details by token ID (read-only)
app.get('/api/sneaker/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;

    const sneaker = await readOnlyContract.sneakers(tokenId);

    res.json({
      success: true,
      tokenId: sneaker.tokenId.toString(),
      serialNumber: sneaker.serialNumber,
      owner: sneaker.currentOwner
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Get all sneakers (read-only)
app.get('/api/sneakers', async (req, res) => {
  try {
    const nextTokenId = await readOnlyContract.nextTokenId();
    const total = Number(nextTokenId);

    const sneakers = [];
    for (let i = 0; i < total; i++) {
      const sneaker = await readOnlyContract.sneakers(i);
      sneakers.push({
        tokenId: sneaker.tokenId.toString(),
        serialNumber: sneaker.serialNumber,
        owner: sneaker.currentOwner
      });
    }

    res.json({
      success: true,
      total,
      sneakers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Get sneakers owned by specific address
app.get('/api/sneakers/owner/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const nextTokenId = await readOnlyContract.nextTokenId();
    const total = Number(nextTokenId);

    const ownedSneakers = [];
    for (let i = 0; i < total; i++) {
      const sneaker = await readOnlyContract.sneakers(i);
      if (sneaker.currentOwner.toLowerCase() === address.toLowerCase()) {
        ownedSneakers.push({
          tokenId: sneaker.tokenId.toString(),
          serialNumber: sneaker.serialNumber,
          owner: sneaker.currentOwner
        });
      }
    }

    res.json({
      success: true,
      count: ownedSneakers.length,
      sneakers: ownedSneakers
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Transfer ownership
app.post('/api/transfer', async (req, res) => {
  try {
    const { tokenId, newOwner } = req.body;

    if (!tokenId || !newOwner) {
      return res.status(400).json({
        success: false,
        error: 'tokenId and newOwner are required'
      });
    }

    console.log(`Transferring token ${tokenId} to ${newOwner}`);

    const tx = await contract.transferOwnership(tokenId, newOwner);
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

    res.json({
      success: true,
      transactionHash: tx.hash,
      tokenId,
      newOwner,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sneaker Registry API is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sneaker Registry API running on port ${PORT}`);
  console.log(`📝 Contract Address: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`👤 Wallet Address: ${wallet.address}`);
});
