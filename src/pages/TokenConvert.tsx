import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, CheckCircle, Coins } from 'lucide-react';
import useUserStore from '../store/userStore';

// Token options with their prices
const tokenOptions = [
  { amount: 5, price: 129000, name: '5 Token' },
  { amount: 10, price: 169000, name: '10 Token' },
  { amount: 50, price: 269000, name: '50 Token' },
  { amount: 100, price: 369000, name: '100 Token' },
];

function TokenConvert() {
  const navigate = useNavigate();
  const { balance } = useUserStore();
  const subtractBalance = useUserStore((state) => state.subtractBalance);
  const addTokens = useUserStore((state) => state.addTokens);
  
  const [selectedTokenAmount, setSelectedTokenAmount] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleTokenSelect = (amount: number) => {
    setSelectedTokenAmount(amount);
    setShowSuccess(false);
  };
  
  const handleConvert = () => {
    if (selectedTokenAmount === null) return;
    
    const tokenOption = tokenOptions.find(option => option.amount === selectedTokenAmount);
    if (!tokenOption) return;
    
    // Check if user has enough balance
    if (balance < tokenOption.price) {
      alert('Insufficient balance to convert tokens');
      return;
    }
    
    // Update balance and token count
    subtractBalance(tokenOption.price);
    addTokens(selectedTokenAmount);
    
    // Show success animation
    setShowSuccess(true);
    
    // Reset after delay
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedTokenAmount(null);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-4 pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white mr-3"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-orbitron text-2xl font-bold gradient-text">CONVERT TOKEN</h1>
        </div>
        
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Select Token Package</h2>
            <div className="bg-dark-300 px-3 py-1 rounded-full text-xs text-primary-300">
              Balance: Rp {balance.toLocaleString()}
            </div>
          </div>
          
          {/* Token Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {tokenOptions.map((option) => (
              <button
                key={option.amount}
                onClick={() => handleTokenSelect(option.amount)}
                className={`flex justify-between items-center p-4 rounded-lg border ${
                  selectedTokenAmount === option.amount 
                    ? 'border-primary-500 bg-primary-900/20' 
                    : 'border-dark-100 bg-dark-300 hover:bg-dark-200'
                } transition-colors`}
              >
                <div className="flex items-center">
                  <Coins className={`mr-3 ${
                    selectedTokenAmount === option.amount ? 'text-primary-400' : 'text-gray-400'
                  }`} />
                  <span className="font-medium">{option.name}</span>
                </div>
                <span className="font-mono">
                  Rp {option.price.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
          
          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={selectedTokenAmount === null || balance < (tokenOptions.find(option => option.amount === selectedTokenAmount)?.price || 0)}
            className={`btn w-full py-3 ${
              selectedTokenAmount !== null && balance >= (tokenOptions.find(option => option.amount === selectedTokenAmount)?.price || 0)
                ? 'bg-accent-600 hover:bg-accent-700 text-white' 
                : 'bg-dark-400 text-gray-500 cursor-not-allowed'
            }`}
          >
            CONVERT
          </button>
        </div>
        
        {/* Success Animation */}
        {showSuccess && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed inset-0 flex items-center justify-center bg-dark-500/80 z-50"
          >
            <div className="bg-dark-200 p-8 rounded-lg text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-success-500/20 flex items-center justify-center"
              >
                <CheckCircle className="text-success-500" size={32} />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Convert Successful!</h3>
              <p className="text-gray-400">
                {selectedTokenAmount} tokens have been added to your account
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default TokenConvert;