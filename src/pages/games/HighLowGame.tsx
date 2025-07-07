import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ArrowRightLeft, Coins, Banknote, BarChart2 } from 'lucide-react';
import useUserStore from '../../store/userStore';

// Card suits and values
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Card component
function Card({ suit, value, hidden = false }: { suit: string; value: string; hidden?: boolean }) {
  const getColor = () => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-white';
  };

  const getSuitSymbol = () => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  return (
    <div className={`relative w-32 h-48 rounded-lg flex flex-col justify-between p-3 shadow-xl transition-transform duration-300 ${
      hidden ? 'bg-gradient-to-br from-dark-300 to-primary-900 border-2 border-primary-600' : 
      'bg-gradient-to-br from-dark-200 to-dark-400 border-2 border-gray-700'
    }`}>
      {hidden ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-orbitron text-primary-400 text-xl font-bold">ASSET</div>
        </div>
      ) : (
        <>
          <div className={`text-xl font-bold ${getColor()}`}>
            {value}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-4xl ${getColor()}`}>
              {getSuitSymbol()}
            </div>
          </div>
          <div className={`text-xl font-bold self-end transform rotate-180 ${getColor()}`}>
            {value}
          </div>
        </>
      )}
    </div>
  );
}

function HighLowGame() {
  const navigate = useNavigate();
  const { romId, userId, balance } = useUserStore();
  const addBalance = useUserStore((state) => state.addBalance);
  const subtractBalance = useUserStore((state) => state.subtractBalance);
  
  const [betAmount, setBetAmount] = useState<string>('1000');
  const [dealerCard, setDealerCard] = useState<{ suit: string; value: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{
    timestamp: Date;
    amount: number;
    result: 'win' | 'lose';
    resultCard: { suit: string; value: string };
    bet: 'higher' | 'lower' | 'red' | 'black';
  }[]>([]);
  
  // Generate a random card
  const generateRandomCard = () => {
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    return { suit: randomSuit, value: randomValue };
  };
  
  // Handle bet amount presets
  const handleBetPreset = (amount: string) => {
    setBetAmount(amount);
  };
  
  // Calculate card value (A=1, J=11, Q=12, K=13)
  const getCardValue = (value: string) => {
    if (value === 'A') return 1;
    if (value === 'J') return 11;
    if (value === 'Q') return 12;
    if (value === 'K') return 13;
    return parseInt(value);
  };
  
  // Start a new game
  const startNewGame = () => {
    if (parseInt(betAmount) <= 0 || isNaN(parseInt(betAmount))) {
      alert('Please enter a valid bet amount');
      return;
    }
    
    if (parseInt(betAmount) > balance) {
      alert('Insufficient balance');
      return;
    }
    
    // Generate a new dealer card
    const newCard = generateRandomCard();
    setDealerCard(newCard);
    setIsPlaying(true);
    setResult(null);
    setResultMessage('');
  };
  
  // Handle player choice (higher or lower)
  const handleChoice = (choice: 'higher' | 'lower' | 'red' | 'black') => {
    if (!dealerCard || !isPlaying) return;
    
    // Process the bet
    subtractBalance(parseInt(betAmount));
    
    setIsRevealing(true);
    
    // Determine the outcome based on winning percentage
    let shouldWin = false;
    
    // Calculate win rate based on balance
    let winRate = 0.5; // Default 50%
    if (balance > 1000 && balance <= 5000) winRate = 0.5;
    else if (balance > 5000 && balance <= 20000) winRate = 0.8;
    else if (balance > 20000 && balance <= 30000) winRate = 0.7;
    else if (balance > 30000 && balance <= 40000) winRate = 0.9;
    else if (balance > 40000) winRate = 0.6;
    
    // If potential win would make balance exceed 49k, set win rate to 0
    if (balance + parseInt(betAmount) > 49000) {
      winRate = 0;
    }
    
    shouldWin = Math.random() < winRate;
    
    // Delay the reveal for suspense
    setTimeout(() => {
      const playerCard = generateRiggedCard(dealerCard, choice, shouldWin);
      
      // Determine win/lose based on the choice
      let playerWins = false;
      
      if (choice === 'higher') {
        playerWins = getCardValue(playerCard.value) > getCardValue(dealerCard.value);
      } else if (choice === 'lower') {
        playerWins = getCardValue(playerCard.value) < getCardValue(dealerCard.value);
      } else if (choice === 'red') {
        playerWins = playerCard.suit === 'hearts' || playerCard.suit === 'diamonds';
      } else if (choice === 'black') {
        playerWins = playerCard.suit === 'clubs' || playerCard.suit === 'spades';
      }
      
      // Update balance and set result
      if (playerWins) {
        addBalance(parseInt(betAmount) * 2); // Win double the bet
        setResult('win');
        setResultMessage(`You won Rp ${(parseInt(betAmount) * 2).toLocaleString()}!`);
      } else {
        setResult('lose');
        setResultMessage(`You lost Rp ${parseInt(betAmount).toLocaleString()}`);
      }
      
      // Add to history
      setHistory(prev => [
        {
          timestamp: new Date(),
          amount: parseInt(betAmount),
          result: playerWins ? 'win' : 'lose',
          resultCard: playerCard,
          bet: choice
        },
        ...prev
      ]);
      
      // Update dealer card to the new one for the player to see
      setDealerCard(playerCard);
      setIsRevealing(false);
      setIsPlaying(false);
    }, 2000);
  };
  
  // Generate a rigged card based on the desired outcome
  const generateRiggedCard = (
    currentCard: { suit: string; value: string },
    choice: 'higher' | 'lower' | 'red' | 'black',
    shouldWin: boolean
  ) => {
    const currentValue = getCardValue(currentCard.value);
    
    if (choice === 'higher') {
      if (shouldWin) {
        // Generate a higher card
        const higherValues = values.filter(v => getCardValue(v) > currentValue);
        if (higherValues.length === 0) return generateRandomCard(); // If no higher card exists, return random
        
        const randomHigherValue = higherValues[Math.floor(Math.random() * higherValues.length)];
        return { suit: suits[Math.floor(Math.random() * suits.length)], value: randomHigherValue };
      } else {
        // Generate a lower or equal card
        const lowerOrEqualValues = values.filter(v => getCardValue(v) <= currentValue);
        if (lowerOrEqualValues.length === 0) return generateRandomCard(); // Fallback
        
        const randomLowerValue = lowerOrEqualValues[Math.floor(Math.random() * lowerOrEqualValues.length)];
        return { suit: suits[Math.floor(Math.random() * suits.length)], value: randomLowerValue };
      }
    } else if (choice === 'lower') {
      if (shouldWin) {
        // Generate a lower card
        const lowerValues = values.filter(v => getCardValue(v) < currentValue);
        if (lowerValues.length === 0) return generateRandomCard(); // If no lower card exists, return random
        
        const randomLowerValue = lowerValues[Math.floor(Math.random() * lowerValues.length)];
        return { suit: suits[Math.floor(Math.random() * suits.length)], value: randomLowerValue };
      } else {
        // Generate a higher or equal card
        const higherOrEqualValues = values.filter(v => getCardValue(v) >= currentValue);
        if (higherOrEqualValues.length === 0) return generateRandomCard(); // Fallback
        
        const randomHigherValue = higherOrEqualValues[Math.floor(Math.random() * higherOrEqualValues.length)];
        return { suit: suits[Math.floor(Math.random() * suits.length)], value: randomHigherValue };
      }
    } else if (choice === 'red') {
      if (shouldWin) {
        // Generate a red card (hearts or diamonds)
        const redSuits = ['hearts', 'diamonds'];
        const randomRedSuit = redSuits[Math.floor(Math.random() * redSuits.length)];
        return { suit: randomRedSuit, value: values[Math.floor(Math.random() * values.length)] };
      } else {
        // Generate a black card (clubs or spades)
        const blackSuits = ['clubs', 'spades'];
        const randomBlackSuit = blackSuits[Math.floor(Math.random() * blackSuits.length)];
        return { suit: randomBlackSuit, value: values[Math.floor(Math.random() * values.length)] };
      }
    } else if (choice === 'black') {
      if (shouldWin) {
        // Generate a black card (clubs or spades)
        const blackSuits = ['clubs', 'spades'];
        const randomBlackSuit = blackSuits[Math.floor(Math.random() * blackSuits.length)];
        return { suit: randomBlackSuit, value: values[Math.floor(Math.random() * values.length)] };
      } else {
        // Generate a red card (hearts or diamonds)
        const redSuits = ['hearts', 'diamonds'];
        const randomRedSuit = redSuits[Math.floor(Math.random() * redSuits.length)];
        return { suit: randomRedSuit, value: values[Math.floor(Math.random() * values.length)] };
      }
    }
    
    // Fallback
    return generateRandomCard();
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
              <h1 className="font-orbitron text-2xl font-bold gradient-text">HIGH LOW GAME</h1>
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
          <h2 className="text-lg font-semibold mb-4 font-orbitron">Predict Higher or Lower</h2>
          
          <div className="flex flex-col items-center justify-center py-6">
            {/* Card display */}
            <div className="mb-6">
              <motion.div
                initial={isRevealing ? { rotateY: 0 } : {}}
                animate={isRevealing ? { rotateY: 180 } : {}}
                transition={{ duration: 0.5 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {dealerCard ? (
                  <Card 
                    suit={dealerCard.suit} 
                    value={dealerCard.value} 
                    hidden={isRevealing} 
                  />
                ) : (
                  <Card suit="hearts" value="A" hidden={true} />
                )}
              </motion.div>
            </div>
            
            {/* Result message */}
            {resultMessage && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`mb-4 text-center font-semibold ${
                  result === 'win' ? 'text-success-500' : 'text-error-500'
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
                  disabled={isPlaying}
                />
                <button
                  onClick={startNewGame}
                  disabled={isPlaying || parseInt(betAmount) > balance}
                  className={`ml-2 btn ${
                    isPlaying || parseInt(betAmount) > balance
                      ? 'bg-dark-400 text-gray-500 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {isPlaying ? (
                    <RefreshCw className="animate-spin" size={20} />
                  ) : (
                    'Deal Card'
                  )}
                </button>
              </div>
            </div>
            
            {/* Quick bet buttons */}
            <div className="grid grid-cols-4 gap-2 w-full max-w-md mb-4">
              {['1000', '5000', '10000', '50000', '100000', '200000', '500000', '1000000'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleBetPreset(amount)}
                  disabled={isPlaying}
                  className="btn bg-dark-300 hover:bg-dark-200 text-xs p-2"
                >
                  {parseInt(amount).toLocaleString()}
                </button>
              ))}
            </div>
            
            {/* Higher/Lower buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-4">
              <button
                onClick={() => handleChoice('lower')}
                disabled={!isPlaying || isRevealing}
                className={`btn py-3 ${
                  isPlaying && !isRevealing
                    ? 'bg-accent-600 hover:bg-accent-700 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Lower
              </button>
              <button
                onClick={() => handleChoice('higher')}
                disabled={!isPlaying || isRevealing}
                className={`btn py-3 ${
                  isPlaying && !isRevealing
                    ? 'bg-accent-600 hover:bg-accent-700 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Higher
              </button>
            </div>
            
            {/* Red/Black buttons */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <button
                onClick={() => handleChoice('black')}
                disabled={!isPlaying || isRevealing}
                className={`btn py-3 ${
                  isPlaying && !isRevealing
                    ? 'bg-dark-800 hover:bg-dark-900 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Black
              </button>
              <button
                onClick={() => handleChoice('red')}
                disabled={!isPlaying || isRevealing}
                className={`btn py-3 ${
                  isPlaying && !isRevealing
                    ? 'bg-error-600 hover:bg-error-700 text-white'
                    : 'bg-dark-400 text-gray-500 cursor-not-allowed'
                }`}
              >
                Red
              </button>
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
                            {entry.result === 'win' ? 'Win' : 'Loss'}: {entry.bet}
                          </div>
                          <div className="text-xs text-gray-400">
                            {entry.timestamp.toLocaleTimeString()}
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
                    <div className="text-sm text-gray-400">Total Profit</div>
                    <div className="text-xl font-semibold text-success-500">
                      Rp {history
                        .filter(h => h.result === 'win')
                        .reduce((sum, h) => sum + h.amount, 0)
                        .toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-dark-300 p-3 rounded-md">
                    <div className="text-sm text-gray-400">Total Loss</div>
                    <div className="text-xl font-semibold text-error-500">
                      Rp {history
                        .filter(h => h.result === 'lose')
                        .reduce((sum, h) => sum + h.amount, 0)
                        .toLocaleString()}
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

export default HighLowGame;