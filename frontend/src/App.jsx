import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Package, Shield, Users, Menu, X, Wallet } from 'lucide-react';

// Smart Contract ABI (extracted from your Solidity contract)
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

// Replace with your deployed contract address
// You can set this in .env file as REACT_APP_CONTRACT_ADDRESS
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isManufacturer, setIsManufacturer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Connect to MetaMask
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this application');
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setContract(contractInstance);

      // Check if connected account is manufacturer
      const manufacturerAddress = await contractInstance.manufacturer();
      setIsManufacturer(accounts[0].toLowerCase() === manufacturerAddress.toLowerCase());
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  useEffect(() => {
    // Auto-connect if already connected
    if (window.ethereum && window.ethereum.selectedAddress) {
      connectWallet();
    }
  }, []);

  // Home Page Component
  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section with Sneaker Animation */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="text-8xl animate-bounce-slow">👟</div>
                <div className="absolute -top-2 -right-2">
                  <Shield className="text-green-400" size={32} />
                </div>
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              Authentic <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Sneakers</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-6">
              Verified on Blockchain
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Combat counterfeits with immutable blockchain technology. Every sneaker, verified. Every transaction, transparent.
            </p>

            {!account ? (
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
              >
                <Wallet size={28} />
                Connect Wallet to Begin
              </button>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 inline-block border border-white/20">
                <p className="text-sm text-purple-300 mb-2">🔗 Connected Wallet</p>
                <p className="font-mono text-lg text-white font-bold">{account.substring(0, 8)}...{account.substring(36)}</p>
                {isManufacturer && (
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                      ⭐ Manufacturer Account
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feature Cards with Sneaker Theme */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Manufacturer Card */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition border border-white/20 hover:border-purple-400 transform hover:scale-105 duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="text-6xl">🏭</div>
                  <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-2">
                    <Package className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center">Manufacturer</h3>
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Mint authentic sneakers as NFTs and create tamper-proof digital certificates on the blockchain
              </p>
              <button
                onClick={() => setCurrentPage('manufacturer')}
                disabled={!account || !isManufacturer}
                className={`w-full py-4 rounded-xl font-bold text-lg transition transform ${
                  account && isManufacturer
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!account ? '🔒 Connect Wallet' : !isManufacturer ? '🏭 Manufacturer Only' : '✨ Access Dashboard'}
              </button>
            </div>

            {/* Retailer Card */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition border border-white/20 hover:border-green-400 transform hover:scale-105 duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="text-6xl">🛍️</div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <Shield className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center">Retailer Portal</h3>
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Instantly verify sneaker authenticity and complete ownership history before making a sale
              </p>
              <button
                onClick={() => setCurrentPage('retailer')}
                disabled={!account}
                className={`w-full py-4 rounded-xl font-bold text-lg transition transform ${
                  account
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!account ? '🔒 Connect Wallet' : '🔍 Verify Products'}
              </button>
            </div>

            {/* Customer Card */}
            <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition border border-white/20 hover:border-pink-400 transform hover:scale-105 duration-300">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="text-6xl">👤</div>
                  <div className="absolute -bottom-2 -right-2 bg-pink-500 rounded-full p-2">
                    <Users className="text-white" size={20} />
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-3 text-center">Customer App</h3>
              <p className="text-gray-300 mb-6 text-center leading-relaxed">
                Browse your verified sneaker collection, check authenticity, and securely transfer ownership
              </p>
              <button
                onClick={() => setCurrentPage('customer')}
                disabled={!account}
                className={`w-full py-4 rounded-xl font-bold text-lg transition transform ${
                  account
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {!account ? '🔒 Connect Wallet' : '👟 My Sneakers'}
              </button>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-10 border border-white/20">
            <h2 className="text-4xl font-bold text-white mb-4 text-center">How It Works</h2>
            <p className="text-center text-purple-300 mb-10 text-lg">Four simple steps to authentic sneakers</p>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition">
                  1
                </div>
                <div className="text-4xl mb-3">🏭</div>
                <h4 className="font-bold text-white text-xl mb-2">Mint NFT</h4>
                <p className="text-sm text-gray-300">Manufacturer creates a unique digital twin on the blockchain</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition">
                  2
                </div>
                <div className="text-4xl mb-3">✅</div>
                <h4 className="font-bold text-white text-xl mb-2">Verify</h4>
                <p className="text-sm text-gray-300">Retailers instantly confirm authenticity through blockchain</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition">
                  3
                </div>
                <div className="text-4xl mb-3">🛒</div>
                <h4 className="font-bold text-white text-xl mb-2">Purchase</h4>
                <p className="text-sm text-gray-300">Customers receive verified authentic sneakers with confidence</p>
              </div>
              <div className="text-center group">
                <div className="bg-gradient-to-br from-pink-500 to-rose-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition">
                  4
                </div>
                <div className="text-4xl mb-3">📜</div>
                <h4 className="font-bold text-white text-xl mb-2">Track History</h4>
                <p className="text-sm text-gray-300">Complete lifecycle permanently recorded and accessible</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                100%
              </div>
              <p className="text-gray-300 text-lg">Authentic Verification</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                ∞
              </div>
              <p className="text-gray-300 text-lg">Immutable Records</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                0%
              </div>
              <p className="text-gray-300 text-lg">Counterfeit Risk</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Manufacturer Dashboard Component
  const ManufacturerPage = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [mintedSneakers, setMintedSneakers] = useState([]);

    const handleMint = async (e) => {
      e.preventDefault();
      if (!serialNumber || !contract) return;

      setLoading(true);
      try {
        const tx = await contract.mintSneaker(serialNumber);
        await tx.wait();
        alert(`Sneaker minted successfully! Serial: ${serialNumber}`);
        setSerialNumber('');
        loadMintedSneakers();
      } catch (error) {
        console.error('Minting error:', error);
        alert('Failed to mint sneaker: ' + (error.reason || error.message));
      } finally {
        setLoading(false);
      }
    };

    const loadMintedSneakers = async () => {
      if (!contract) return;
      try {
        const totalTokens = await contract.nextTokenId();
        const sneakers = [];
        for (let i = 0; i < totalTokens; i++) {
          const sneaker = await contract.sneakers(i);
          sneakers.push({
            tokenId: sneaker.tokenId.toString(),
            serialNumber: sneaker.serialNumber,
            owner: sneaker.currentOwner
          });
        }
        setMintedSneakers(sneakers);
      } catch (error) {
        console.error('Error loading sneakers:', error);
      }
    };

    useEffect(() => {
      loadMintedSneakers();
    }, [contract]);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-300 hover:text-white font-semibold flex items-center gap-2 transition"
          >
            ← Back to Home
          </button>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">🏭</div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Manufacturer Dashboard</h2>
                <p className="text-purple-300">Mint authentic sneakers and create blockchain certificates</p>
              </div>
            </div>

            <form onSubmit={handleMint} className="mb-8">
              <div className="mb-4">
                <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <span>👟</span> Serial Number
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g., NIKE-JORDAN-2024-001234"
                  className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 transition transform hover:scale-105 shadow-xl disabled:transform-none"
              >
                {loading ? '⏳ Minting...' : '✨ Mint Sneaker NFT'}
              </button>
            </form>

            <div className="bg-indigo-500/20 rounded-xl p-4 border border-indigo-400/30">
              <p className="text-sm text-indigo-200">
                💡 <strong>Tip:</strong> Use a clear naming convention like BRAND-MODEL-YEAR-NUMBER for easy identification
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>📦</span> Minted Sneakers ({mintedSneakers.length})
            </h3>
            {mintedSneakers.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">👟</div>
                <p className="text-gray-300 text-lg">No sneakers minted yet</p>
                <p className="text-gray-400 text-sm mt-2">Mint your first sneaker to get started!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mintedSneakers.map((sneaker) => (
                  <div key={sneaker.tokenId} className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-indigo-400/30 rounded-2xl p-6 hover:border-indigo-400 hover:shadow-2xl transition transform hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Token #{sneaker.tokenId}
                      </span>
                      <div className="text-3xl">👟</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <div className="text-5xl text-center mb-2">🔐</div>
                      <p className="text-center text-xs text-gray-400">Blockchain Verified</p>
                    </div>
                    <p className="text-white font-bold mb-2 text-lg">
                      {sneaker.serialNumber}
                    </p>
                    <p className="text-gray-300 text-xs break-all mb-3">
                      Owner: {sneaker.owner.substring(0, 20)}...
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-semibold text-sm">✓ Authentic</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Retailer Verification Page Component
  const RetailerPage = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
      e.preventDefault();
      if (!serialNumber || !contract) return;

      setLoading(true);
      setVerificationResult(null);

      try {
        const result = await contract.verifySneaker(serialNumber);
        setVerificationResult({
          tokenId: result.tokenId.toString(),
          owner: result.owner,
          isAuthentic: true
        });
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationResult({
          isAuthentic: false,
          error: 'Sneaker not found in registry - possibly counterfeit'
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-slate-900 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-green-300 hover:text-white font-semibold flex items-center gap-2 transition"
          >
            ← Back to Home
          </button>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl">🛍️</div>
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">Retailer Verification Portal</h2>
                <p className="text-green-300">Instantly verify sneaker authenticity on the blockchain</p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="mb-8">
              <div className="mb-6">
                <label className="block text-white font-bold mb-3 text-lg flex items-center gap-2">
                  <span>🔍</span> Enter Serial Number to Verify
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g., NIKE-JORDAN-2024-001234"
                  className="w-full px-6 py-4 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 transition transform hover:scale-105 shadow-xl"
              >
                {loading ? '🔄 Verifying...' : '🔍 Verify Authenticity'}
              </button>
            </form>

            {verificationResult && (
              <div className={`p-8 rounded-2xl border-4 ${verificationResult.isAuthentic ? 'bg-green-500/20 border-green-400' : 'bg-red-500/20 border-red-400'} backdrop-blur-sm animate-fadeIn`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-6xl">
                    {verificationResult.isAuthentic ? '✅' : '❌'}
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${verificationResult.isAuthentic ? 'text-green-100' : 'text-red-100'}`}>
                      {verificationResult.isAuthentic ? 'Authentic Sneaker' : 'NOT AUTHENTIC'}
                    </h3>
                    {verificationResult.isAuthentic && (
                      <p className="text-green-200 text-lg">✓ Verified on Blockchain</p>
                    )}
                  </div>
                </div>

                {verificationResult.isAuthentic ? (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-green-200 text-sm mb-1">Token ID</p>
                          <p className="text-white font-bold text-2xl">#{verificationResult.tokenId}</p>
                        </div>
                        <div className="text-center md:text-right">
                          <div className="text-5xl mb-2">👟</div>
                          <p className="text-green-200 text-sm">Blockchain Verified</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                      <p className="text-green-200 text-sm mb-2">Current Owner Address</p>
                      <p className="font-mono text-white break-all bg-black/20 p-3 rounded-lg">{verificationResult.owner}</p>
                    </div>

                    <div className="bg-green-400/20 rounded-xl p-4 border border-green-400/40">
                      <p className="text-green-100 font-bold flex items-center gap-2">
                        <span>🎉</span> This sneaker is registered on the blockchain and verified authentic.
                      </p>
                      <p className="text-green-200 text-sm mt-2">
                        Safe to proceed with purchase.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm text-center">
                      <div className="text-6xl mb-4">⚠️</div>
                      <p className="text-red-100 font-bold text-xl mb-2">
                        {verificationResult.error}
                      </p>
                    </div>
                    <div className="bg-red-400/20 rounded-xl p-4 border border-red-400/40">
                      <p className="text-red-100 font-bold">
                        ⛔ Warning: This product may be counterfeit!
                      </p>
                      <p className="text-red-200 text-sm mt-2">
                        Do not proceed with purchase. The serial number is not registered in our blockchain registry.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!verificationResult && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-300 text-lg">Enter a serial number to verify</p>
                <p className="text-gray-400 text-sm mt-2">Results will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Customer App Component
  const CustomerPage = () => {
    const [mySneakers, setMySneakers] = useState([]);
    const [transferTokenId, setTransferTokenId] = useState('');
    const [newOwnerAddress, setNewOwnerAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [verifySerial, setVerifySerial] = useState('');
    const [verifyResult, setVerifyResult] = useState(null);

    const loadMySneakers = async () => {
      if (!contract || !account) return;

      try {
        const totalTokens = await contract.nextTokenId();
        const userSneakers = [];

        for (let i = 0; i < totalTokens; i++) {
          const sneaker = await contract.sneakers(i);
          if (sneaker.currentOwner.toLowerCase() === account.toLowerCase()) {
            userSneakers.push({
              tokenId: sneaker.tokenId.toString(),
              serialNumber: sneaker.serialNumber,
              owner: sneaker.currentOwner
            });
          }
        }
        setMySneakers(userSneakers);
      } catch (error) {
        console.error('Error loading sneakers:', error);
      }
    };

    useEffect(() => {
      loadMySneakers();
    }, [contract, account]);

    const handleTransfer = async (e) => {
      e.preventDefault();
      if (!contract) return;

      setLoading(true);
      try {
        const tx = await contract.transferOwnership(transferTokenId, newOwnerAddress);
        await tx.wait();
        alert('Ownership transferred successfully!');
        setTransferTokenId('');
        setNewOwnerAddress('');
        loadMySneakers();
      } catch (error) {
        console.error('Transfer error:', error);
        alert('Failed to transfer: ' + (error.reason || error.message));
      } finally {
        setLoading(false);
      }
    };

    const handleVerify = async (e) => {
      e.preventDefault();
      if (!contract) return;

      try {
        const result = await contract.verifySneaker(verifySerial);
        setVerifyResult({
          tokenId: result.tokenId.toString(),
          owner: result.owner,
          isAuthentic: true
        });
      } catch (error) {
        setVerifyResult({ isAuthentic: false });
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <button
            onClick={() => setCurrentPage('home')}
            className="mb-6 text-purple-300 hover:text-white font-semibold flex items-center gap-2 transition"
          >
            ← Back to Home
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="text-5xl">👤</div>
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">My Sneaker Collection</h2>
              <p className="text-purple-300">Manage your verified authentic sneakers</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Transfer Ownership Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🔄</div>
                <h3 className="text-2xl font-bold text-white">Transfer Ownership</h3>
              </div>
              <form onSubmit={handleTransfer}>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Token ID</label>
                  <input
                    type="number"
                    value={transferTokenId}
                    onChange={(e) => setTransferTokenId(e.target.value)}
                    placeholder="Enter Token ID"
                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">New Owner Address</label>
                  <input
                    type="text"
                    value={newOwnerAddress}
                    onChange={(e) => setNewOwnerAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 transition transform hover:scale-105"
                >
                  {loading ? '⏳ Transferring...' : '🔄 Transfer Ownership'}
                </button>
              </form>
            </div>

            {/* Quick Verify Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">🔍</div>
                <h3 className="text-2xl font-bold text-white">Quick Verify</h3>
              </div>
              <form onSubmit={handleVerify}>
                <div className="mb-4">
                  <label className="block text-white font-semibold mb-2">Serial Number</label>
                  <input
                    type="text"
                    value={verifySerial}
                    onChange={(e) => setVerifySerial(e.target.value)}
                    placeholder="Enter serial number"
                    className="w-full px-4 py-3 bg-white/20 border-2 border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition transform hover:scale-105"
                >
                  🔍 Verify Authenticity
                </button>
              </form>

              {verifyResult && (
                <div className={`mt-4 p-4 rounded-xl ${verifyResult.isAuthentic ? 'bg-green-500/20 border-2 border-green-400' : 'bg-red-500/20 border-2 border-red-400'}`}>
                  {verifyResult.isAuthentic ? (
                    <div>
                      <p className="font-bold text-green-100 flex items-center gap-2">
                        <span>✅</span> Authentic
                      </p>
                      <p className="text-sm text-green-200 mt-1">Token #{verifyResult.tokenId}</p>
                    </div>
                  ) : (
                    <p className="font-bold text-red-100 flex items-center gap-2">
                      <span>❌</span> Not Found
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sneaker Collection Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
              <span>👟</span> Your Collection ({mySneakers.length} Sneakers)
            </h3>
            {mySneakers.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-7xl mb-6">📦</div>
                <p className="text-gray-300 text-xl mb-2">Your collection is empty</p>
                <p className="text-gray-400">You don't own any registered sneakers yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySneakers.map((sneaker) => (
                  <div key={sneaker.tokenId} className="bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border-2 border-purple-400/30 rounded-2xl p-6 hover:border-pink-400 hover:shadow-2xl transition transform hover:scale-105 group">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        Token #{sneaker.tokenId}
                      </span>
                      <div className="text-3xl group-hover:scale-110 transition">👟</div>
                    </div>

                    {/* Sneaker Visual */}
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-4 border-2 border-white/10">
                      <div className="text-6xl text-center mb-2">🔐</div>
                      <p className="text-center text-xs text-purple-200">Blockchain Verified</p>
                    </div>

                    <p className="text-white font-bold mb-2 text-lg break-all">
                      {sneaker.serialNumber}
                    </p>
                    <p className="text-xs text-gray-300 break-all mb-3 bg-black/20 p-2 rounded">
                      {sneaker.owner.substring(0, 25)}...
                    </p>
                    <div className="flex items-center justify-center gap-2 pt-3 border-t border-white/20">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-bold text-sm">✓ Verified Authentic</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'manufacturer' && <ManufacturerPage />}
      {currentPage === 'retailer' && <RetailerPage />}
      {currentPage === 'customer' && <CustomerPage />}
    </div>
  );
}

export default App;