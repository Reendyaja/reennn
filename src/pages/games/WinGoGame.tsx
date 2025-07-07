import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ArrowRightLeft, Coins, Banknote, BarChart2 } from 'lucide-react';
import useUserStore from '../../store/userStore';

// Number range and colors
const numbers = Array.from({ length: 14 }, (_, i) => i + 1);
const colors = {
  red: [1, 3, 5, 7, 9, 11, 13],
  green: [2, 4, 6, 8, 10, 12, 14]
};

function WinGoGame() {
  const navigate = useNavigate();
  const { romId, userId, balance } = useUserStore();
  const addBalance = useUserStore((state) => state.addBalance);
  const subtractBalance = useUserStore((state) => state.subtractBalance);
  
  const [betAmount, setBetAmount] = useState<string>('1000');
  const [selectedBet, setSelectedBet] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{
    timestamp: Date;
    amount: number;
    result: 'win' | 'lose';
    betType: string;
    resultNumber: number;
  }[]>([]);
  
  // Handle bet amount presets
  const handleBetPreset = (amount: string) => {
    setBetAmount(amount);
  };
  
  // Process bet
  const processBet = (betType: string) => {
    if (parseInt(betAmount) <= 0 || isNaN(parseInt(betAmount))) {
      alert('Please enter a valid bet amount');
      return;
    }
    
    if (parseInt(betAmount) > balance) {
      alert('Insufficient balance');
      return;
    }
    
    // Deduct the bet amount
    subtractBalance(parseInt(betAmount));
    
    // Set selected bet type
    setSelectedBet(betType);
    
    // Start spinning
    setIsSpinning(true);
    
    // Determine outcome based on winning percentage
    let shouldWin = false;
    
    // Calculate win rate based on balance
    let winRate = 0.5; // Default 50%
    if (balance > 1000 && balance <= 5000) winRate = 0.5;
    else if (balance > 5000 && balance <= 20000) winRate = 0.8;
    else if (balance > 20000 && balance <= 30000) winRate = 0.7;
    else if (balance > 30000 && balance <= 40000) winRate = 0.9;
    else if (balance > 40000) winRate = 0.6;
    
    // If potential win would make balance exceed 49k, set win rate to 0
    const potentialWin = calculatePotentialWin(betType);
    if (balance + potentialWin > 49000) {
      winRate = 0;
    }
    
    shouldWin = Math.random() < winRate;
    
    // Generate a rigged result
    const riggedResult = generateRiggedResult(betType, shouldWin);
    
    // Simulate spinning
    setTimeout(() => {
      setResult(riggedResult);
      
      // Determine win/lose and update balance
      const playerWins = checkWin(betType, riggedResult);
      
      if (playerWins) {
        const winAmount = calculatePotentialWin(betType);
        addBalance(winAmount);
        setResultMessage(`You won Rp ${winAmount.toLocaleString()}!`);
      } else {
        setResultMessage(`You lost Rp ${parseInt(betAmount).toLocaleString()}`);
      }
      
      // Add to history
      setHistory(prev => [
        {
          timestamp: new Date(),
          amount: parseInt(betAmount),
          result: playerWins ? 'win' : 'lose',
          betType,
          resultNumber: riggedResult
        },
        ...prev
      ]);
      
      setIsSpinning(false);
      setSelectedBet(null);
    }, 3000);
  };
  
  // Check if the bet is a winner based on the result
  const checkWin = (betType: string, resultNumber: number): boolean => {
    if (betType === 'odd') {
      return resultNumber % 2 !== 0;
    } else if (betType === 'even') {
      return resultNumber % 2 === 0;
    } else if (betType === 'small') {
      return resultNumber >= 1 && resultNumber <= 7;
    } else if (betType === 'big') {
      return resultNumber >= 8 && resultNumber <= 14;
    } else if (betType === 'red') {
      return colors.red.includes(resultNumber);
    } else if (betType === 'green') {
      return colors.green.includes(resultNumber);
    } else {
      // Direct number bet
      return parseInt(betType) === resultNumber;
    }
  };
  
  // Calculate potential win amount
  const calculatePotentialWin = (betType: string): number => {
    const betAmountValue = parseInt(betAmount);
    
    if (['odd', 'even', 'small', 'big', 'red', 'green'].includes(betType)) {
      return betAmountValue * 2; // 1:1 payout
    } else {
      // Direct number bet has higher payout (13:1)
      return betAmountValue * 14;
    }
  };
  
  // Generate a rigged result based on the bet type and desired outcome
  const generateRiggedResult = (betType: string, shouldWin: boolean): number => {
    if (shouldWin) {
      // Generate a winning number
      if (betType === 'odd') {
        const oddNumbers = numbers.filter(n => n % 2 !== 0);
        return oddNumbers[Math.floor(Math.random() * oddNumbers.length)];
      } else if (betType === 'even') {
        const evenNumbers = numbers.filter(n => n % 2 === 0);
        return evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
      } else if (betType === 'small') {
        return Math.floor(Math.random() * 7) + 1; // 1-7
      } else if (betType === 'big') {
        return Math.floor(Math.random() * 7) + 8; // 8-14
      } else if (betType === 'red') {
        return colors.red[Math.floor(Math.random() * colors.red.length)];
      } else if (betType === 'green') {
        return colors.green[Math.floor(Math.random() * colors.green.length)];
      } else {
        // Direct number bet
        return parseInt(betType);
      }
    } else {
      // Generate a losing number
      if (betType === 'odd') {
        const evenNumbers = numbers.filter(n => n % 2 === 0);
        return evenNumbers[Math.floor(Math.random() * evenNumbers.length)];
      } else if (betType === 'even') {
        const oddNumbers = numbers.filter(n => n % 2 !== 0);
        return oddNumbers[Math.floor(Math.random() * oddNumbers.length)];
      } else if (betType === 'small') {
        return Math.floor(Math.random() * 7) + 8; // 8-14
      } else if (betType === 'big') {
        return Math.floor(Math.random() * 7) + 1; // 1-7
      } else if (betType === 'red') {
        return colors.green[Math.floor(Math.random() * colors.green.length)];
      } else if (betType === 'green') {
        return colors.red[Math.floor(Math.random() * colors.red.length)];
      } else {
        // Direct number bet
        let losingNumbers = numbers.filter(n => n !== parseInt(betType));
        return losingNumbers[Math.floor(Math.random() * losingNumbers.length)];
      }
    }
  };
  
  // Check if balance is low
  useEffect(() => {
    if (balance < 1000) {
      const timer = setTimeout(() => {
        alert('Your balance has been depleted. Please deposit to continue playing.');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [balance]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen pt-4 pb-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-3 md:space-y-0">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-white mr-3"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="font-orbitron text-2xl font-bold gradient-text">WINGO GAME</h1>
              <div className="flex text-xs text-gray-400">
                <span className="mr-4">ID Rom: {romId}</span>
                <span>ID User: {userId}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-400">
              Balance: <span className="text-success-500 font-mono">Rp {balance.toLocaleString()}</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate('/convert')}
                className="btn bg-dark-300 hover:bg-dark-200 text-xs py-1 px-3"
              >
                <Coins size={14} className="mr-1" />
                Convert
              </button>
              <button 
                onClick={() => navigate('/deposit')}
                className="btn bg-dark-300 hover:bg-dark-200 text-xs py-1 px-3"
              >
                <Banknote size={14} className="mr-1" />
                Deposit
              </button>
              <button 
                onClick={() => navigate('/withdraw')}
                className="btn bg-dark-300 hover:bg-dark-200 text-xs py-1 px-3"
              >
                <ArrowRightLeft size={14} className="mr-1" />
                Withdraw
              </button>
            </div>
          </div>
        </div>
        
        {/* Game section */}
        <div className="card p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 font-orbitron">
            Predict Number, Color, Odd/Even, Big/Small
          </h2>
          
          <div className="flex flex-col items-center justify-center py-6">
            {/* Result display */}
            <div className="mb-6 relative">
              <div className="h-36 w-36 rounded-full border-4 border-primary-600 flex items-center justify-center bg-dark-300 shadow-neon">
                {isSpinning ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-4xl font-bold font-orbitron"
                  >
                    <RefreshCw size={48} className="text-primary-400" />
                  </motion.div>
                ) : result !== null ? (
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring" }}
                    className={`text-5xl font-bold font-orbitron ${
                      colors.red.includes(result) ? 'text-error-500' : 'text-success-500'
                    }`}
                  >
                    {result}
                  </motion.div>
                ) : (
                  <div className="text-4xl font-bold font-orbitron text-primary-400 opacity-50">
                    ?
                  </div>
                )}
              </div>
            </div>
            
            {/* Result message */}
            {resultMessage && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mb-4 text-center font-semibold ${
                  resultMessage.includes('won') ? 'text-success-500' : 'text-error-500'
                }`}
              >
                {resultMessage}
              </motion.div>
            )}
            
            {/* Bet controls */}
            <div className="w-full max-w-md mb-4">
              <label className="block text-sm text-gray-400 mb-1">Bet Amount</label>
              <div className="flex">
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  min="1000"
                  max="1000000"
                  className="input flex-1 font-mono"
                  disabled={isSpinning}
                />
                <button
                  onClick={() => selectedBet && processBet(selectedBet)}
                  disabled={isSpinning || !selectedBet || parseInt(betAmount) > balance}
                  className={`ml-2 btn ${
                    isSpinning || !selectedBet || parseInt(betAmount) > balance
                      ? 'bg-dark-400 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {isSpinning ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    'Spin'
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick bet buttons */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-6">
              {['1000', '5000', '10000', '50000', '100000', '200000', '500000', '1000000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetPreset(amount)}
                  disabled={isSpinning}
                  className="btn bg-dark-300 hover:bg-dark-200 text-xs p-2"
                >
                  {parseInt(amount).toLocaleString()}
                </button>
              ))}
            </div>
            
            {/* Odd/Even & Big/Small buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-4">
              <button
                onClick={() => processBet('odd')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'odd' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-300 hover:bg-dark-200 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Odd
              </button>
              <button
                onClick={() => processBet('even')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'even' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-300 hover:bg-dark-200 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Even
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              <button
                onClick={() => processBet('small')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'small' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-300 hover:bg-dark-200 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Small (1-7)
              </button>
              <button
                onClick={() => processBet('big')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'big' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-300 hover:bg-dark-200 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Big (8-14)
              </button>
            </div>
            
            {/* Red/Green buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
              <button
                onClick={() => processBet('red')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'red' 
                      ? 'bg-error-600 text-white' 
                      : 'bg-error-600/70 hover:bg-error-600 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Red
              </button>
              <button
                onClick={() => processBet('green')}
                disabled={isSpinning}
                className={`btn py-3 ${
                  !isSpinning
                    ? selectedBet === 'green' 
                      ? 'bg-success-600 text-white' 
                      : 'bg-success-600/70 hover:bg-success-600 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Green
              </button>
            </div>
            
            {/* Number buttons */}
            <div className="w-full max-w-md">
              <h3 className="text-sm text-gray-400 mb-2">Bet on Number (14x payout)</h3>
              <div className="grid grid-cols-7 gap-2">
                {numbers.map((num) => (
                  <button
                    key={num}
                    onClick={() => processBet(num.toString())}
                    disabled={isSpinning}
                    className={`btn py-3 ${
                      !isSpinning
                        ? selectedBet === num.toString() 
                          ? colors.red.includes(num) 
                            ? 'bg-error-600 text-white' 
                            : 'bg-success-600 text-white'
                          : colors.red.includes(num) 
                            ? 'bg-error-600/30 hover:bg-error-600/50 text-white' 
                            : 'bg-success-600/30 hover:bg-success-600/50 text-white'
                        : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* History & Stats */}
        <div className="mb-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="btn btn-outline w-full flex items-center justify-center"
          >
            <BarChart2 className="mr-2" size={18} />
            {showHistory ? 'Hide History & Stats' : 'Show History & Stats'}
          </button>
        </div>
        
        {showHistory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">History</h3>
              <div className="max-h-60 overflow-y-auto">
                {history.length > 0 ? (
                  <div className="space-y-2">
                    {history.map((entry, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-dark-300 rounded-md">
                        <div>
                          <div className={`text-sm ${
                            entry.result === 'win' ? 'text-success-500' : 'text-error-500'
                          }`}>
                            {entry.result === 'win' ? 'Win' : 'Loss'}: {entry.betType}
                          </div>
                          <div className="text-xs text-gray-400">
                            Result: <span className={colors.red.includes(entry.resultNumber) ? 'text-error-500' : 'text-success-500'}>
                              {entry.resultNumber}
                            </span> • {entry.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                        <div className="font-mono">
                          {entry.result === 'win' ? '+' : '-'}
                          {entry.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-6">
                    No game history yet
                  </div>
                )}
              </div>
            </div>
            
            <div className="card p-4">
              <h3 className="text-lg font-semibold mb-3">Statistics</h3>
              
              <div className="space-y-4">
                <div className="bg-dark-300 p-3 rounded-md">
                  <div className="text-sm text-gray-400">Total Games</div>
                  <div className="text-2xl font-semibold">{history.length}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-300 p-3 rounded-md">
                    <div className="text-sm text-gray-400">Wins</div>
                    <div className="text-xl font-semibold text-success-500">
                      {history.filter(h => h.result === 'win').length}
                    </div>
                  </div>
                  
                  <div className="bg-dark-300 p-3 rounded-md">
                    <div className="text-sm text-gray-400">Losses</div>
                    <div className="text-xl font-semibold text-error-500">
                      {history.filter(h => h.result === 'lose').length}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-dark-300 p-3 rounded-md">
                    <div className="text-sm text-gray-400">Most Common Result</div>
                    <div className="text-xl font-semibold">
                      {history.length > 0 ? 
                        Object.entries(
                          history.reduce((acc, h) => {
                            acc[h.resultNumber] = (acc[h.resultNumber] || 0) + 1;
                            return acc;
                          }, {} as Record<number, number>)
                        ).sort((a, b) => b[1] - a[1])[0][0] : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="bg-dark-300 p-3 rounded-md">
                    <div className="text-sm text-gray-400">Net Profit/Loss</div>
                    <div className={`text-xl font-semibold ${
                      history.reduce((sum, h) => h.result === 'win' ? sum + h.amount : sum - h.amount, 0) >= 0 
                        ? 'text-success-500' 
                        : 'text-error-500'
                    }`}>
                      Rp {Math.abs(
                        history.reduce((sum, h) => h.result === 'win' ? sum + h.amount : sum - h.amount, 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default WinGoGame;