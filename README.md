# Blockchain-based-System-for-Sneaker-Authentication-and-Lifecycle-Management

## 📖 Description
This project implements a blockchain-backed sneaker authentication system where each sneaker is recorded on the Ethereum Sepolia test network.
The system provides:
* A Solidity smart contract (SneakerRegistry) that securely stores sneaker serial numbers, token IDs, and ownership.
* A Node.js backend API that interacts with the smart contract using ethers.js.
* A React front-end for manufacturer and customer interactions (minting, verifying, transferring, and viewing collection).

The goal is to combat counterfeits by enabling transparent, verifiable sneaker authenticity and ownership history.

**Tech Stack:**
- Blockchain Framework: Ethereum Sepolia Testnet  
- Smart Contract Language: Solidity  
- Frontend: ReactJS  
- Backend: Node.js + Express  

---

## ⚙️ Setup Instructions
### 1. Clone the repository:
      git clone https://github.com/Sai-Tharun-25/Blockchain-based-System-for-Sneaker-Authentication-and-Lifecycle-Management
      
### 2. Deploy Smart Contract to Sepolia:
   - Open `SneakerRegistry.sol` in Remix
   - Connect MetaMask -> switch to Sepolia testnet
   - Compile contract
   - Deploy using Injected Provider (MetaMask)
   - Copy the deployed contract address

### 3. Configure Backend:
   - Navigate to `/backend` and create `.env`:
      ```
      SEPOLIA_RPC_URL=<Alchemy_or_Infura_RPC_URL>
      PRIVATE_KEY=<Your_Private_Key>
      CONTRACT_ADDRESS=<Contract_Address_From_Remix>
      PORT=5001
      ```
      
   - Install backend dependencies:
     ```bash
     npm install

   - Start backend server:
     ```bash
     node server.js

   - Expected output:
     ```
      Sneaker Registry API running on port 5001
      Contract Address: <address>
      Wallet Address: <backend wallet>
     ```
### 4. Configure Frontend:
   Navigate to `/frontend`:
   ```
   npm install
   npm start
   ```
   Frontend runs at:
   `http://localhost:3000`


---

## 🧩 How to Use the System

#### Manufacturer Portal

- Click Connect to Blockchain
- Manufacturer wallet is auto-detected via backend API
- Mint sneakers by entering a serial number
- Blockchain stores new tokenId + owner
- See all minted sneakers in dashboard

#### Customer Portal

- Verify authenticity using a serial number
- View token ID, owner, and authenticity status
- Transfer ownership to another wallet
- View entire sneaker collection owned by the address

---

## 📝 Smart Contract Summary

`SneakerRegistry.sol` provides:
- `mintSneaker(serial)` - Manufacturer-only minting
- `verifySneaker(serial)` - Returns tokenId + currentOwner
- `transferOwnership(tokenId, newOwner)` - Only current owner can transfer
- `sneakers(id)` - Returns sneaker struct
- `nextTokenId()` - Auto-increment counter
- Event logs:
   * `SneakerMinted`
   * `OwnershipTransferred`
All authenticity and ownership data is stored on-chain.

---

## 🎯 Deployment Summary

The completed system includes:
   * Smart contract deployed on Sepolia
   * Node backend connected to blockchain
   * Fully functional React frontend
   * Full lifecycle operations:
      - Mint
      - Verify
      - Transfer
      - Collection view

This project demonstrates how blockchain can solve authenticity and ownership challenges for real-world products.
