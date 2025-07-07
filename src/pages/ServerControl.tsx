import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, Clock, Shield, Terminal, Cpu, Lock } from 'lucide-react';
import useUserStore from '../store/userStore';
import SHA256 from 'crypto-js/sha256';
import { useInterval } from 'react-use';

// Server options
const servers = {
  DIDIHUB: {
    name: 'DIDIHUB',
    categories: ['HILLO', 'X50', 'WINGO', 'ROULETTE'],
    urls: {
      HILLO: 'https://www.didihub.com/hilo?spreadCode=WMKIT',
      X50: 'https://www.didihub.com/x50?spreadCode=WMKIT',
      WINGO: 'https://www.didihub.com/wingo?spreadCode=WMKIT',
      ROULETTE: 'https://www.didihub.com/roulette?spreadCode=WMKIT'
    }
  },
  '66ROLLWIN': {
    name: '66ROLLWIN',
    categories: ['HILLO', 'X50', 'WINGO', 'ROULETTE'],
    urls: {
      HILLO: 'https://www.66rollwin.com/register?code=U3I2F',
      X50: 'https://www.66rollwin.com/register?code=U3I2F',
      WINGO: 'https://www.66rollwin.com/register?code=U3I2F',
      ROULETTE: 'https://www.66rollwin.com/register?code=U3I2F'
    }
  },
  '55FIVE': {
    name: '55FIVE',
    categories: ['WINGO', 'K3 LOTRE', '5D LOTRE', 'TRX WIN'],
    urls: {
      WINGO: 'https://olymptrade.com/platform',
      'K3 LOTRE': 'https://olymptrade.com/platform',
      '5D LOTRE': 'https://olymptrade.com/platform',
      'TRX WIN': 'https://olymptrade.com/platform'
    }
  },
  BINOMO: {
    name: 'BINOMO',
    categories: ['CRYPTO IDX', 'EUR/USD', 'USD/JPY', 'USD/CAD'],
    urls: {
      'CRYPTO IDX': 'https://www.bnomo-r.com',
      'EUR/USD': 'https://www.bnomo-r.com',
      'USD/JPY': 'https://www.bnomo-r.com',
      'USD/CAD': 'https://www.bnomo-r.com'
    }
  },
  STOCKITY: {
    name: 'STOCKITY',
    categories: ['CRYPTO IDX', 'EUR/USD'],
    urls: {
      'CRYPTO IDX': 'https://stockity.id/auth',
      'EUR/USD': 'https://stockity.id/auth'
    }
  },
  OLYMPTRADE: {
    name: 'OLYMPTRADE',
    categories: ['EUR/USD', 'USD/JPY', 'USD/CAD'],
    urls: {
      'EUR/USD': 'https://olymptrade.com/platform',
      'USD/JPY': 'https://olymptrade.com/platform',
      'USD/CAD': 'https://olymptrade.com/platform'
    }
  }
};

// Result types based on server and category
const getResultType = (server: string, category: string) => {
  if (['BINOMO', 'STOCKITY', 'OLYMPTRADE'].includes(server)) {
    return {
      type: 'TRADE',
      options: ['BUY', 'SELL'],
      timing: [0]
    };
  } else if (server === '55FIVE') {
    return {
      type: 'SIZE',
      options: ['KECIL', 'BESAR'],
      timing: [0]
    };
  } else if (category === 'X50') {
    return {
      type: 'COLOR',
      options: ['Blue', 'Red', 'Green'],
      timing: [35, 5]
    };
  } else if (category === 'ROULETTE') {
    return {
      type: 'COLOR',
      options: ['Black', 'Red'],
      timing: [45, 25, 5]
    };
  } else {
    return {
      type: 'CARD',
      options: ['2', '3', '4', '5', '6', '7', '8', '9', 'J', 'Q', 'K', 'A'],
      colors: ['Black', 'Red'],
      timing: [15, 30, 45, 0]
    };
  }
};

function ServerControl() {
  const navigate = useNavigate();
  const { tokenBalance, subtractTokens } = useUserStore();
  
  const [selectedServer, setSelectedServer] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentHash, setCurrentHash] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [resultColor, setResultColor] = useState<string | null>(null);
  const [uniqueCode, setUniqueCode] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every second
  useInterval(() => {
    setCurrentTime(new Date());
  }, 1000);
  
  // Generate random hash for animation
  const generateRandomHash = useCallback(() => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return SHA256(Array.from(randomBytes).join('')).toString();
  }, []);
  
  // Handle hash animation
  useInterval(() => {
    if (isProcessing) {
      setCurrentHash(generateRandomHash());
    }
  }, 100);
  
  // Check if current second matches timing requirements
  const checkTiming = useCallback((timing: number[]) => {
    const currentSecond = currentTime.getSeconds();
    return timing.includes(currentSecond);
  }, [currentTime]);
  
  // Generate result based on server and category
  const generateResult = useCallback(() => {
    const resultConfig = getResultType(selectedServer, selectedCategory);
    
    if (resultConfig.type === 'CARD') {
      const card = resultConfig.options[Math.floor(Math.random() * resultConfig.options.length)];
      const color = resultConfig.colors[Math.floor(Math.random() * resultConfig.colors.length)];
      return { result: card, color };
    } else if (resultConfig.type === 'COLOR') {
      const color = resultConfig.options[Math.floor(Math.random() * resultConfig.options.length)];
      return { result: color, color };
    } else {
      const result = resultConfig.options[Math.floor(Math.random() * resultConfig.options.length)];
      return { result, color: null };
    }
  }, [selectedServer, selectedCategory]);
  
  // Handle get result
  const handleGetResult = useCallback(() => {
    if (tokenBalance < 1) {
      setShowResult(true);
      return;
    }
    
    setIsProcessing(true);
    setShowResult(false);
    setResult(null);
    setResultColor(null);
    
    const resultConfig = getResultType(selectedServer, selectedCategory);
    
    // Start checking for timing
    const interval = setInterval(() => {
      if (checkTiming(resultConfig.timing)) {
        clearInterval(interval);
        
        // Generate result
        const { result: newResult, color } = generateResult();
        setResult(newResult);
        setResultColor(color);
        
        // Generate unique code
        setUniqueCode(Math.random().toString(36).substring(2, 8).toUpperCase());
        
        // Subtract token
        subtractTokens(1);
        
        setIsProcessing(false);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [tokenBalance, selectedServer, selectedCategory, checkTiming, generateResult, subtractTokens]);
  
  // Initialize Tawk.to
  useEffect(() => {
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6809673a4667bd190d1c36d6/1ipibmfu0';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.body.appendChild(s1);
    
    return () => {
      document.body.removeChild(s1);
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-4 pb-20 px-4 bg-[#090909] text-gray-100"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-primary-400 mr-3"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="font-orbitron text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                SERVER CONTROL PANEL
              </h1>
              <div className="flex items-center text-xs text-gray-400">
                <Clock size={12} className="mr-1" />
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xs text-gray-400">
              Tokens: <span className="text-primary-400 font-mono">{tokenBalance}</span>
            </div>
            <button 
              onClick={() => navigate('/')}
              className="btn bg-dark-300 hover:bg-dark-200 text-xs py-1 px-3"
            >
              <Home size={14} className="mr-1" />
              Home
            </button>
          </div>
        </div>
        
        {/* Server selection */}
        <div className="card bg-dark-300/50 backdrop-blur border border-dark-100 p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="mr-2 text-primary-400" />
            Select Server
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.keys(servers).map((server) => (
              <button
                key={server}
                onClick={() => {
                  setSelectedServer(server);
                  setSelectedCategory('');
                  setShowResult(false);
                  setResult(null);
                }}
                className={`p-4 rounded-lg border ${
                  selectedServer === server
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-dark-100 bg-dark-400/50 hover:bg-dark-300/50'
                } transition-all duration-200`}
              >
                <Cpu className={`mx-auto mb-2 ${
                  selectedServer === server ? 'text-primary-400' : 'text-gray-400'
                }`} />
                <span className="block text-sm font-medium">{server}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Category selection */}
        {selectedServer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-dark-300/50 backdrop-blur border border-dark-100 p-4 mb-6"
          >
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Terminal className="mr-2 text-primary-400" />
              Select Category
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {servers[selectedServer as keyof typeof servers].categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setShowResult(false);
                    setResult(null);
                  }}
                  className={`p-4 rounded-lg border ${
                    selectedCategory === category
                      ? 'border-primary-500 bg-primary-500/10'
                      : 'border-dark-100 bg-dark-400/50 hover:bg-dark-300/50'
                  } transition-all duration-200`}
                >
                  <Lock className={`mx-auto mb-2 ${
                    selectedCategory === category ? 'text-primary-400' : 'text-gray-400'
                  }`} />
                  <span className="block text-sm font-medium">{category}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Result display */}
        {selectedServer && selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Webview */}
            <div className="card bg-dark-300/50 backdrop-blur border border-dark-100 overflow-hidden">
              <iframe
                src={servers[selectedServer as keyof typeof servers].urls[selectedCategory as keyof typeof servers['DIDIHUB']['urls']]}
                className="w-full h-[60vh] border-none"
                title="Game View"
              />
            </div>
            
            {/* Get result button */}
            <div className="card bg-dark-300/50 backdrop-blur border border-dark-100 p-4">
              {tokenBalance < 1 ? (
                <div className="text-center p-6">
                  <Lock className="mx-auto mb-4 text-primary-400" size={48} />
                  <h3 className="text-xl font-bold mb-2">Access Required</h3>
                  <p className="text-gray-400 mb-4">
                    Nikmati akses prediksi akurat hingga 100% dengan minimal 1 Token.
                    Upgrade dengan pilihan token lainnya untuk hak akses lebih luas — tanpa masa aktif!
                  </p>
                  <button
                    onClick={() => navigate('/order')}
                    className="btn btn-primary"
                  >
                    Get Tokens
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    onClick={handleGetResult}
                    disabled={isProcessing}
                    className="btn w-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-400 disabled:text-gray-500 py-4 text-lg font-bold"
                  >
                    GET RESULT SERVER VIP
                  </button>
                  
                  {/* Processing animation */}
                  <AnimatePresence>
                    {isProcessing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 font-mono"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <Terminal className="animate-pulse text-primary-400 mr-2" />
                          <span className="text-primary-400">Brute Force Attack in Progress</span>
                        </div>
                        <div className="bg-dark-400 p-3 rounded-lg overflow-hidden">
                          <motion.div
                            animate={{ y: [-20, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-xs text-primary-300 font-mono"
                          >
                            {currentHash}
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* Result display */}
                  <AnimatePresence>
                    {result && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="mt-6 text-center"
                      >
                        <div className={`inline-block p-6 rounded-lg ${
                          resultColor === 'Red' ? 'bg-red-500/20' :
                          resultColor === 'Black' ? 'bg-gray-800/50' :
                          resultColor === 'Blue' ? 'bg-blue-500/20' :
                          resultColor === 'Green' ? 'bg-green-500/20' :
                          'bg-primary-500/20'
                        }`}>
                          <h3 className={`text-4xl font-bold mb-2 ${
                            resultColor === 'Red' ? 'text-red-500' :
                            resultColor === 'Black' ? 'text-white' :
                            resultColor === 'Blue' ? 'text-blue-500' :
                            resultColor === 'Green' ? 'text-green-500' :
                            'text-primary-500'
                          }`}>
                            {result}
                          </h3>
                          <p className="text-gray-400 font-mono text-sm">
                            Code: {uniqueCode}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ServerControl;