import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, RefreshCw, Copy, Wallet, Banknote, ArrowRightLeft } from 'lucide-react';
import useUserStore from '../store/userStore';

function Dashboard() {
  const navigate = useNavigate();
  const { userId, romId, tokenBalance, balance, usedBonusCodes } = useUserStore();
  const [bonusCode, setBonusCode] = useState('');
  const [redemptionStatus, setRedemptionStatus] = useState<string | null>(null);
  const redeemBonusCode = useUserStore((state) => state.redeemBonusCode);

  const handleBonusRedemption = () => {
    if (!bonusCode) {
      setRedemptionStatus('Please enter a valid bonus code');
      return;
    }
    
    if (bonusCode === 'BFA404' && usedBonusCodes.includes('BFA404')) {
      setRedemptionStatus('Welcome bonus code has already been used');
      return;
    }
    
    const success = redeemBonusCode(bonusCode);
    
    if (success) {
      setRedemptionStatus('Bonus code successfully redeemed!');
      setBonusCode('');
      setTimeout(() => setRedemptionStatus(null), 3000);
    } else {
      setRedemptionStatus('Invalid bonus code. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-4 pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:justify-between mb-8 space-y-4 md:space-y-0">
          <div className="card p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-400">ID User</p>
                <div className="flex items-center">
                  <span className="font-mono text-lg text-primary-300">{userId || 'GUEST'}</span>
                  <button 
                    onClick={() => copyToClipboard(userId)}
                    className="ml-2 text-gray-400 hover:text-primary-400"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-400">ID Rom</p>
              <div className="flex items-center">
                <span className="font-mono text-lg text-primary-300">{romId}</span>
                <button 
                  onClick={() => copyToClipboard(romId)}
                  className="ml-2 text-gray-400 hover:text-primary-400"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex justify-between mb-4">
              <div>
                <p className="text-xs text-gray-400">Token VIP</p>
                <div className="flex items-center">
                  <span className="font-mono text-lg text-accent-400">{tokenBalance}</span>
                  <button className="ml-2 text-gray-400 hover:text-accent-400">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400">Balance</p>
              <div className="flex items-center">
                <span className="font-mono text-lg text-success-500">Rp {balance.toLocaleString()}</span>
                <button className="ml-2 text-gray-400 hover:text-success-500">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bonus code redemption */}
        <div className="card p-4 mb-8">
          <h3 className="text-sm font-semibold mb-3">Redeem Bonus</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={bonusCode}
              onChange={(e) => setBonusCode(e.target.value)}
              placeholder="Enter Kode Bonus"
              className="input flex-1"
            />
            <button 
              onClick={handleBonusRedemption}
              className="btn btn-accent"
            >
              Redeem
            </button>
          </div>
          {redemptionStatus && (
            <p className={`mt-2 text-sm ${redemptionStatus.includes('successfully') ? 'text-success-500' : 'text-error-500'}`}>
              {redemptionStatus}
            </p>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => navigate('/order')}
            className="btn btn-outline py-4 flex-col h-auto"
          >
            <Wallet className="mb-2" size={24} />
            <span>Order Token</span>
          </button>
          <button 
            onClick={() => navigate('/deposit')}
            className="btn btn-outline py-4 flex-col h-auto"
          >
            <Banknote className="mb-2" size={24} />
            <span>Deposit</span>
          </button>
          <button 
            onClick={() => navigate('/withdraw')}
            className="btn btn-outline py-4 flex-col h-auto"
          >
            <ArrowRightLeft className="mb-2" size={24} />
            <span>Withdraw</span>
          </button>
        </div>
        
        {/* Server control panel */}
        <div className="card p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-orbitron text-xl font-bold text-primary-300">SERVER SIGNAL</h2>
            <Cpu className="text-primary-400" />
          </div>
          
          <button 
            onClick={() => navigate('/server-control')}
            className="btn btn-primary w-full py-3"
          >
            Access Control Panel
          </button>
        </div>
        
        {/* Games section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-400 mb-3">SERVERS BONUS (NewMember)</h3>
          <p className="text-sm text-gray-300 mb-4">
            Play servers below to instantly receive a free balance of Rp30,000! Balance can be instantly exchanged for token IDs.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/highlow')}
              className="card bg-dark-300 hover:bg-dark-200 transition-colors border-primary-600/30 p-6 text-center"
            >
              <h3 className="font-orbitron text-lg font-bold text-primary-400 mb-2">HighLow</h3>
              <p className="text-xs text-gray-400">Card-based betting game</p>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/wingo')}
              className="card bg-dark-300 hover:bg-dark-200 transition-colors border-accent-600/30 p-6 text-center"
            >
              <h3 className="font-orbitron text-lg font-bold text-accent-400 mb-2">WinGo</h3>
              <p className="text-xs text-gray-400">Color and number prediction</p>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;