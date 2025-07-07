import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import useUserStore from '../store/userStore';

// Bank options
const paymentMethods = [
  { id: 'bri', name: 'BRI', logo: 'https://tempototo.com/assets/img/bri.webp?v=1745855011' },
  { id: 'bca', name: 'BCA', logo: 'https://tempototo.com/assets/img/bca.webp?v=1745855011' },
  { id: 'mandiri', name: 'MANDIRI', logo: 'https://tempototo.com/assets/img/mandiri.webp?v=1745855011' },
  { id: 'permata', name: 'PERMATA', logo: 'https://tempototo.com/assets/img/permata.webp?v=1745855011' },
  { id: 'cimb', name: 'CIMB', logo: 'https://tempototo.com/assets/img/cimb.webp?v=1745855011' },
  { id: 'bni', name: 'BNI', logo: 'https://tempototo.com/assets/img/bni.webp?v=1745855011' },
  { id: 'danamon', name: 'DANAMON', logo: 'https://tempototo.com/assets/img/danamon.webp?v=1745855011' },
  { id: 'dana', name: 'DANA', logo: 'https://tempototo.com/assets/img/dana.webp?v=1745855011' },
  { id: 'ovo', name: 'OVO', logo: 'https://tempototo.com/assets/img/ovo.webp?v=1745855011' },
  { id: 'gopay', name: 'GOPAY', logo: 'https://tempototo.com/assets/img/gopay.webp?v=1745855011' },
  { id: 'linkaja', name: 'LINK AJA', logo: 'https://tempototo.com/assets/img/linkaja.webp?v=1745855011' },
];

function Withdraw() {
  const navigate = useNavigate();
  const { balance } = useUserStore();
  const subtractBalance = useUserStore((state) => state.subtractBalance);
  
  const [amount, setAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [withdrawalsRemaining, setWithdrawalsRemaining] = useState(3);
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };
  
  const handleWithdraw = () => {
    // Validate input
    if (!amount || !recipientName || !selectedMethod || !accountNumber) {
      setStatus({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }
    
    const amountValue = parseInt(amount);
    
    if (isNaN(amountValue) || amountValue < 50000 || amountValue > 50000000) {
      setStatus({
        type: 'error',
        message: 'Amount must be between 50,000 and 50,000,000'
      });
      return;
    }
    
    if (amountValue > balance) {
      setStatus({
        type: 'error',
        message: 'Insufficient balance'
      });
      return;
    }
    
    // Process withdrawal
    subtractBalance(amountValue);
    setWithdrawalsRemaining(withdrawalsRemaining - 1);
    
    setStatus({
      type: 'success',
      message: 'Withdrawal request is being processed'
    });
    
    // Reset form
    setAmount('');
    setRecipientName('');
    setAccountNumber('');
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
          <h1 className="font-orbitron text-2xl font-bold gradient-text">WITHDRAW</h1>
        </div>
        
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Withdrawal Form</h2>
            <div className="bg-dark-300 px-3 py-1 rounded-full text-xs text-primary-300">
              Balance: Rp {balance.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-dark-300 p-3 rounded-md mb-4 text-xs text-accent-300 border-l-2 border-accent-500">
            <p>Any bonus can be withdrawn after the balance reaches 3x the bonus amount.</p>
          </div>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Recipient Name</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Enter recipient name"
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Amount (Min: 50,000, Max: 50,000,000)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="input w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className="input w-full"
              />
            </div>
          </div>
          
          <h3 className="text-md font-medium mb-3">Select Bank</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handleMethodSelect(method.id)}
                className={`flex flex-col items-center p-2 rounded-lg border ${
                  selectedMethod === method.id 
                    ? 'border-primary-500 bg-primary-900/20' 
                    : 'border-dark-100 bg-dark-300 hover:bg-dark-200'
                } transition-colors`}
              >
                <img 
                  src={method.logo} 
                  alt={method.name} 
                  className="h-6 mb-1 object-contain" 
                />
                <span className="text-xs">{method.name}</span>
              </button>
            ))}
          </div>
          
          {status && (
            <div className={`mb-4 p-3 rounded-md ${
              status.type === 'success' ? 'bg-success-500/20 text-success-500' : 'bg-error-500/20 text-error-500'
            }`}>
              <div className="flex items-start">
                {status.type === 'success' ? (
                  <CheckCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                )}
                <p>{status.message}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleWithdraw}
            className="btn btn-primary w-full py-3"
          >
            Withdraw
          </button>
          
          <div className="mt-4 text-sm text-gray-400">
            <div className="flex items-center mb-2">
              <ShieldCheck size={14} className="mr-1 text-primary-400" />
              <span>Withdrawals remaining today: {withdrawalsRemaining}</span>
            </div>
            <p className="text-xs">
              Under normal conditions, withdrawals will arrive within two hours. Please wait patiently. 
              If withdrawing at midnight, expect to receive funds by morning at the latest. 
              If your account hasn't received the withdrawal amount after a long time, please contact Customer Service.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Withdraw;