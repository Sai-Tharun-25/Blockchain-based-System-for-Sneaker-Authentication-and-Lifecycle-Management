import React, { useState, useEffect } from 'react';
import { Package, Shield, Users, Menu, X, Server, LogOut, UserCheck, Home, ArrowLeft } from 'lucide-react';

// API Base URL
const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userType, setUserType] = useState(null); // 'manufacturer' or 'customer'
  const [account, setAccount] = useState('');
  const [isManufacturer, setIsManufacturer] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Connect to backend
  const connectBackend = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wallet-address`);
      const data = await response.json();

      if (data.success) {
        setAccount(data.address);
        setIsManufacturer(data.isManufacturer);
      } else {
        alert('Failed to connect to backend');
      }
    } catch (error) {
      console.error('Error connecting to backend:', error);
      alert('Backend connection failed. Make sure server is running on port 5001');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectBackend();
  }, []);

  // Login as Manufacturer
  const loginAsManufacturer = () => {
    if (!isManufacturer) {
      alert('Connected wallet is not the manufacturer account!');
      return;
    }
    setUserType('manufacturer');
    setCurrentPage('mint');
  };

  // Login as Customer
  const loginAsCustomer = () => {
    setUserType('customer');
    setCurrentPage('verify');
  };

  // Go back to home
  const goBackToHome = () => {
    setUserType(null);
    setCurrentPage('home');
  };

  // Home/Login Selection Page
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
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Combat counterfeits with immutable blockchain technology. Every sneaker, verified. Every transaction, transparent.
            </p>

            {!account ? (
              <button
                onClick={connectBackend}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
              >
                <Server className="w-6 h-6" />
                {loading ? 'Connecting...' : 'Connect to Blockchain'}
              </button>
            ) : (
              <div className="space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto border border-white/20 shadow-xl">
                  <p className="text-green-400 font-semibold mb-2 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Connected to Blockchain
                  </p>
                  <p className="text-white text-sm font-mono">
                    {account.substring(0, 8)}...{account.substring(36)}
                  </p>
                  {isManufacturer && (
                    <p className="text-purple-400 text-xs mt-2 flex items-center justify-center gap-1">
                      <span>✨</span> Manufacturer Account Detected
                    </p>
                  )}
                </div>

                {/* Login Options */}
                <div className="max-w-5xl mx-auto">
                  <h2 className="text-3xl text-white font-bold mb-8">Choose Your Portal</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Manufacturer Portal */}
                    <div
                      onClick={loginAsManufacturer}
                      className={`group bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl p-8 border-2 ${
                        isManufacturer 
                          ? 'border-purple-500 hover:border-purple-400 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/50' 
                          : 'border-gray-600 opacity-60 cursor-not-allowed'
                      } transition-all duration-300 ${isManufacturer ? 'transform hover:scale-105 hover:-translate-y-2' : ''}`}
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-xl">
                        <Package className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 text-center">Manufacturer Portal</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed">
                        Mint authentic sneakers as NFTs and manage blockchain certificates with full control
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        {isManufacturer ? (
                          <>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-green-400 font-semibold">Access Granted</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-red-400">Manufacturer Access Only</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Customer Portal */}
                    <div
                      onClick={loginAsCustomer}
                      className="group bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md rounded-3xl p-8 border-2 border-blue-500 hover:border-blue-400 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/50"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-12 transition-transform duration-300 shadow-xl">
                        <Users className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 text-center">Customer Portal</h3>
                      <p className="text-gray-300 text-center mb-6 leading-relaxed">
                        Verify sneaker authenticity and manage your verified collection on the blockchain
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-semibold">Open to Everyone</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-xl text-gray-400">Four simple steps to authenticate sneakers</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 group">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">1️⃣</div>
            <h3 className="text-white font-bold text-xl mb-3">Mint</h3>
            <p className="text-gray-400 leading-relaxed">Manufacturer creates digital twin on blockchain</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 group">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">2️⃣</div>
            <h3 className="text-white font-bold text-xl mb-3">Verify</h3>
            <p className="text-gray-400 leading-relaxed">Customers confirm authenticity instantly</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 group">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">3️⃣</div>
            <h3 className="text-white font-bold text-xl mb-3">Purchase</h3>
            <p className="text-gray-400 leading-relaxed">Buy with confidence knowing it's authentic</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 group">
            <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">4️⃣</div>
            <h3 className="text-white font-bold text-xl mb-3">Track</h3>
            <p className="text-gray-400 leading-relaxed">Complete lifecycle permanently recorded</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-green-900/30 to-green-800/10 backdrop-blur-sm rounded-3xl p-10 border border-green-500/30 hover:border-green-500/60 transition-all hover:transform hover:scale-105">
            <div className="text-6xl mb-6">✅</div>
            <h3 className="text-3xl font-bold text-white mb-4">Authentic Verification</h3>
            <p className="text-gray-300 leading-relaxed">Instant blockchain verification ensures every sneaker is genuine and traceable</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 backdrop-blur-sm rounded-3xl p-10 border border-purple-500/30 hover:border-purple-500/60 transition-all hover:transform hover:scale-105">
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-3xl font-bold text-white mb-4">Immutable Records</h3>
            <p className="text-gray-300 leading-relaxed">Ownership history permanently stored on blockchain, impossible to forge</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/10 backdrop-blur-sm rounded-3xl p-10 border border-red-500/30 hover:border-red-500/60 transition-all hover:transform hover:scale-105">
            <div className="text-6xl mb-6">🚫</div>
            <h3 className="text-3xl font-bold text-white mb-4">Zero Counterfeits</h3>
            <p className="text-gray-300 leading-relaxed">Eliminate fake products and protect brand reputation with blockchain security</p>
          </div>
        </div>
      </div>
    </div>
  );


  // Mint Page (Manufacturer Only)
  const MintPage = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [mintedSneakers, setMintedSneakers] = useState([]);
    const [minting, setMinting] = useState(false);

    useEffect(() => {
      loadMintedSneakers();
    }, []);

    const loadMintedSneakers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sneakers`);
        const data = await response.json();
        if (data.success) {
          setMintedSneakers(data.sneakers);
        }
      } catch (error) {
        console.error('Error loading sneakers:', error);
      }
    };

    const handleMint = async (e) => {
      e.preventDefault();
      if (!serialNumber) {
        alert('Please enter a serial number');
        return;
      }

      try {
        setMinting(true);
        const response = await fetch(`${API_BASE_URL}/mint`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ serialNumber })
        });

        const data = await response.json();

        if (data.success) {
          alert(`✅ Sneaker minted successfully!\nToken ID: ${data.tokenId}\nTx: ${data.transactionHash}`);
          setSerialNumber('');
          loadMintedSneakers();
        } else {
          alert(`❌ Minting failed: ${data.error}`);
        }
      } catch (error) {
        console.error('Mint error:', error);
        alert('Minting failed. Check console for details.');
      } finally {
        setMinting(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={goBackToHome}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Manufacturer Badge */}
          <div className="bg-purple-500/20 border border-purple-500/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-purple-400" />
            <div>
              <p className="text-purple-400 font-semibold">Manufacturer Portal</p>
              <p className="text-gray-400 text-sm">Logged in as: {account.substring(0, 10)}...{account.substring(36)}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Mint New Sneaker</h2>
            <p className="text-gray-300 mb-6">
              Create blockchain certificates for authentic sneakers
            </p>

            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Serial Number</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="e.g., NIKE-AIRJORDAN-2025-001"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={minting}
                />
                <p className="text-sm text-gray-400 mt-2">
                  **Tip:** Use format BRAND-MODEL-YEAR-NUMBER
                </p>
              </div>

              <button
                type="submit"
                disabled={minting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {minting ? '⏳ Minting...' : '🎨 Mint Sneaker NFT'}
              </button>
            </form>
          </div>

          {/* Minted Sneakers List */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              All Minted Sneakers ({mintedSneakers.length})
            </h3>

            {mintedSneakers.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No sneakers minted yet</p>
                <p className="text-gray-500 text-sm mt-2">Mint your first sneaker to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {mintedSneakers.map((sneaker) => (
                  <div
                    key={sneaker.tokenId}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-400 text-sm mb-1">Token #{sneaker.tokenId}</p>
                        <p className="text-white font-semibold text-lg mb-2">
                          {sneaker.serialNumber}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Owner: {sneaker.owner.substring(0, 20)}...
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        ✓ Verified
                      </span>
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

  // Verify Page (Customer)
  const VerifyPage = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [verifying, setVerifying] = useState(false);

    const handleVerify = async (e) => {
      e.preventDefault();
      if (!serialNumber) {
        alert('Please enter a serial number');
        return;
      }

      try {
        setVerifying(true);
        setVerificationResult(null);

        const response = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(serialNumber)}`);
        const data = await response.json();

        if (data.success) {
          setVerificationResult({
            found: true,
            tokenId: data.tokenId,
            owner: data.owner,
            serialNumber: data.serialNumber
          });
        } else {
          setVerificationResult({
            found: false,
            error: data.error
          });
        }
      } catch (error) {
        console.error('Verify error:', error);
        setVerificationResult({
          found: false,
          error: 'Verification failed. Sneaker not found.'
        });
      } finally {
        setVerifying(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={goBackToHome}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Customer Badge */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-blue-400 font-semibold">Customer Portal</p>
              <p className="text-gray-400 text-sm">Verify authentic sneakers on the blockchain</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Verify Sneaker Authenticity</h2>
            <p className="text-gray-300 mb-6">
              Enter the serial number to instantly verify on blockchain
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Serial Number</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter sneaker serial number"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={verifying}
                />
              </div>

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? '🔍 Verifying...' : '🔍 Verify Authenticity'}
              </button>
            </form>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              {verificationResult.found ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-400">✓ Verified Authentic</h3>
                      <p className="text-gray-400 text-sm">This sneaker is registered on blockchain</p>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-6 space-y-4">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Token ID</p>
                      <p className="text-white text-2xl font-bold">#{verificationResult.tokenId}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Serial Number</p>
                      <p className="text-white font-mono">{verificationResult.serialNumber}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-1">Current Owner</p>
                      <p className="text-white font-mono text-sm break-all">{verificationResult.owner}</p>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <p className="text-green-400 font-semibold">
                      🎉 Safe to Purchase
                    </p>
                    <p className="text-green-300 text-sm mt-1">This product is verified authentic and registered on the blockchain.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-400">❌ Not Verified</h3>
                      <p className="text-gray-400 text-sm">Sneaker not found in registry</p>
                    </div>
                  </div>

                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 font-semibold mb-2">
                      ⛔ Warning: Potential Counterfeit
                    </p>
                    <p className="text-red-300 text-sm">
                      This serial number is NOT registered in our blockchain registry. Do not proceed with purchase.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!verificationResult && (
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Enter a serial number to verify</p>
              <p className="text-gray-500 text-sm mt-2">Results will appear here</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Collection Page (Customer)
  const CollectionPage = () => {
    const [collection, setCollection] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      loadCollection();
    }, [account]);

    const loadCollection = async () => {
      if (!account) return;

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/sneakers/owner/${account}`);
        const data = await response.json();

        if (data.success) {
          setCollection(data.sneakers);
        }
      } catch (error) {
        console.error('Error loading collection:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={goBackToHome}
            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Customer Badge */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-blue-400 font-semibold">My Collection</p>
              <p className="text-gray-400 text-sm">Wallet: {account.substring(0, 10)}...{account.substring(36)}</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">My Verified Sneakers</h2>
            <p className="text-gray-300">
              View all authentic sneakers you own
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-white text-lg">Loading collection...</p>
            </div>
          ) : collection.length === 0 ? (
            <div className="bg-white/5 rounded-2xl p-12 text-center border border-white/10">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Your collection is empty</p>
              <p className="text-gray-500 text-sm mt-2">You don't own any registered sneakers yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collection.map((sneaker) => (
                <div
                  key={sneaker.tokenId}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all"
                >
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                      ✅ Authentic
                    </span>
                  </div>

                  <p className="text-blue-400 text-sm mb-2">Token #{sneaker.tokenId}</p>
                  <p className="text-white font-bold text-xl mb-4">{sneaker.serialNumber}</p>

                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-gray-400 text-xs mb-1">Owner</p>
                    <p className="text-white text-sm font-mono break-all">
                      {sneaker.owner.substring(0, 25)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Navigation Component
  const Navigation = () => {
    if (!userType) return null;

    return (
      <nav className="bg-indigo-950/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-white font-bold text-xl">SneakerAuth</span>
              <span className="ml-4 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                {userType === 'manufacturer' ? '👔 Manufacturer' : '👤 Customer'}
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={goBackToHome}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition"
              >
                <Home className="w-4 h-4" />
                Home
              </button>

              {userType === 'manufacturer' ? (
                <>
                  <button
                    onClick={() => setCurrentPage('mint')}
                    className={`text-white hover:text-purple-400 transition ${
                      currentPage === 'mint' ? 'text-purple-400 font-semibold' : ''
                    }`}
                  >
                    Mint Sneakers
                  </button>
                  <button
                    onClick={() => setCurrentPage('verify')}
                    className={`text-white hover:text-purple-400 transition ${
                      currentPage === 'verify' ? 'text-purple-400 font-semibold' : ''
                    }`}
                  >
                    Verify
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentPage('verify')}
                    className={`text-white hover:text-blue-400 transition ${
                      currentPage === 'verify' ? 'text-blue-400 font-semibold' : ''
                    }`}
                  >
                    Verify Sneakers
                  </button>
                  <button
                    onClick={() => setCurrentPage('collection')}
                    className={`text-white hover:text-blue-400 transition ${
                      currentPage === 'collection' ? 'text-blue-400 font-semibold' : ''
                    }`}
                  >
                    My Collection
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <button
                onClick={() => { goBackToHome(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
              {userType === 'manufacturer' ? (
                <>
                  <button
                    onClick={() => { setCurrentPage('mint'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded"
                  >
                    Mint Sneakers
                  </button>
                  <button
                    onClick={() => { setCurrentPage('verify'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded"
                  >
                    Verify
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setCurrentPage('verify'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded"
                  >
                    Verify Sneakers
                  </button>
                  <button
                    onClick={() => { setCurrentPage('collection'); setMobileMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-white/10 rounded"
                  >
                    My Collection
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  };

  // Render appropriate page
  const renderPage = () => {
    if (!userType) {
      return <HomePage />;
    }

    if (userType === 'manufacturer') {
      switch (currentPage) {
        case 'mint':
          return <MintPage />;
        case 'verify':
          return <VerifyPage />;
        default:
          return <MintPage />;
      }
    }

    switch (currentPage) {
      case 'verify':
        return <VerifyPage />;
      case 'collection':
        return <CollectionPage />;
      default:
        return <VerifyPage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      {renderPage()}
    </div>
  );
}

export default App;
