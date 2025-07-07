import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, KeyRound, Copy, RefreshCw } from 'lucide-react';

// Simulated user IDs
const userIDs = [
  'RTFFLC', '9PYJAJ', 'ZME7HL', 'FRTCRN', '89E4KX',
  '9ZWA0J', 'SIXKZ1', 'B4FKGO', 'DLKR83', '11RR05'
];

function LoginScreen() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [displayId, setDisplayId] = useState(userIDs[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [activityLog, setActivityLog] = useState<string[]>([
    'User 9PYJAJ deposited 500k',
    'User ZME7HL withdrew 200k',
    'User FA69KL converted 10 tokens',
     'User 9PYJAJ deposited 500k',
     'User DLKR83 purchased 10 tokens',
    'User B4FKGO converted 10 tokens',
    'User 11RR05 won 350k in HighLow',
    'User GX80SW purchased 50 tokens',
    'User B4FKGO converted 10 tokens',
'User 11RR05 won 350k in HighLow',
'User DLKR83 purchased 50 tokens',
'User KX93ZP won 150k in HighLow',
'User WM34TV converted 50 tokens',
'User X3JH29 purchased 100 tokens',
'User AJD83K won 250k in HighLow',
'User PZL399 converted 10 tokens',
'User QW19DK purchased 5 tokens',
'User LK01GH won 500k in HighLow',
'User NB3D9A converted 10 tokens',
'User TTR589 purchased 5 tokens',
'User RFK99T won 100k in HighLow',
'User B4FKGO won 350k in HighLow',
'User UUZ923 purchased 10 tokens',
'User 11RR05 converted 50 tokens',
'User CKD771 won 120k in HighLow',
'User MZ4820 purchased 100 tokens',
'User DLKR83 converted 50 tokens',
'User GH02CN won 90k in HighLow',
'User RE91JP purchased 30 tokens',
'User HLM573 won 220k in HighLow',
'User X3JH29 converted 50 tokens',
'User KX93ZP purchased 10 tokens',
'User QW19DK won 500k in HighLow',
'User WM34TV purchased 5 tokens',
'User AJD83K converted 5 tokens',
'User LK01GH purchased 10 tokens',
'User TTR589 won 300k in HighLow',
'User B4FKGO purchased 20 tokens',
'User NB3D9A won 110k in HighLow',
'User PZL399 purchased 50 tokens',
'User RFK99T converted 5 tokens',
'User UUZ923 won 130k in HighLow',
'User CKD771 purchased 50 tokens',
'User GH02CN converted 35 tokens',
'User MZ4820 won 400k in HighLow',
'User RE91JP converted 50 tokens',
'User HLM573 purchased 5 tokens',
'User DLKR83 won 140k in HighLow',
'User X3JH29 won 360k in HighLow',
'User AJD83K purchased 40 tokens',
'User QW19DK converted 100 tokens',
'User KX93ZP purchased 55 tokens',
'User NB3D9A won 200k in HighLow',
'User WM34TV won 180k in HighLow',
'User 11RR05 purchased 20 tokens',
'User TTR589 converted 5 tokens',
'User PZL399 won 170k in HighLow',
'User CKD771 converted 10 tokens',

    'User 11RR05 won 350k in HighLow',
    'User 47RTAL purchased 50 tokens'
  ]);

  // Rotate displayed ID
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * userIDs.length);
      setDisplayId(userIDs[randomIndex]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Rotate activity log
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityLog(prev => {
        const newLog = [...prev];
        // Rotate the first item to the end
        newLog.push(newLog.shift()!);
        return newLog;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    setIsError(false);
    
    // Simulate API call
    setTimeout(() => {
      if (userIDs.includes(userId.toUpperCase())) {
        navigate('/dashboard');
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen flex flex-col items-center justify-center p-4"
    >
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="card p-8 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-secondary-500"></div>
        
        <div className="text-center mb-8">
          <motion.h1
            className="text-3xl font-orbitron font-bold gradient-text"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            ASSET PLATFORM
          </motion.h1>
          <p className="text-gray-400 mt-2">Secure Access Portal</p>
        </div>
        
        <div className="flex items-center justify-between border border-dark-100 bg-dark-300 p-3 rounded-lg mb-6">
          <div className="flex items-center">
            <KeyRound className="text-primary-400 mr-2" size={18} />
            <span className="font-mono font-medium">{displayId}</span>
          </div>
          <button 
            onClick={() => copyToClipboard(displayId)}
            className="p-1.5 hover:bg-dark-200 rounded-md transition-colors"
          >
            <Copy size={16} className="text-gray-400 hover:text-primary-400" />
          </button>
        </div>
        
        <div className="mb-6 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Lock className="text-gray-400" size={18} />
          </div>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your ID"
            className="input pl-10 w-full font-mono"
          />
          {isError && (
            <p className="mt-2 text-error-500 text-sm">Invalid ID. Please try again.</p>
          )}
        </div>
        
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`btn btn-primary w-full py-3 font-medium relative overflow-hidden ${isLoading ? 'opacity-90' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <RefreshCw className="animate-spin mr-2" size={18} />
              <span>Authenticating...</span>
            </div>
          ) : (
            <span className="glitch">LOGIN / MASUK</span>
          )}
        </button>
      </motion.div>
      
      <div className="mt-8 w-full max-w-md">
        <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-2 h-2 bg-primary-500 rounded-full mr-2"
          />
          ACTIVITY LOG
        </h3>
        <div className="h-32 overflow-hidden">
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: -20 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 4.5
            }}
          >
            {activityLog.map((log, index) => (
              <div 
                key={index}
                className="py-1.5 px-3 rounded text-sm my-1 bg-dark-300 text-gray-300"
              >
                {log}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default LoginScreen;