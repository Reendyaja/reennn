import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Clock, Coins } from 'lucide-react';
import useUserStore from '../store/userStore';

// Token packages
const tokenPackages = [
  { amount: 5, price: 159000, name: '5 Token' },
  { amount: 10, price: 199000, name: '10 Token' },
  { amount: 50, price: 299000, name: '50 Token' },
  { amount: 100, price: 399000, name: '100 Token' },
];

// Payment methods
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
  { id: 'qris', name: 'QRIS', logo: 'https://gtyfup2m.112400c1199c.com/logo-qris.png?v=1745855011' },
];

// Bank account numbers
const bankAccounts: Record<string, string> = {
  'bri': '888100831212263784',
  'bca': '39010831212263784',
  'mandiri': '895080831212263784',
  'permata': '85280831212263784',
  'cimb': '80590831212263784',
  'bni': '88100831212263784',
  'danamon': '85280831212263784',
};

// Payment instructions
const paymentInstructions: Record<string, string[]> = {
  'bri': [
    '1. Buka aplikasi BRI Mobile',
    '2. Pilih Transfer > Virtual Account',
    '3. Masukkan nomor Virtual Account',
    '4. Periksa detail transaksi',
    '5. Masukkan PIN untuk konfirmasi'
  ],
  'bca': [
    '1. Login ke m-BCA/BCA Mobile',
    '2. Pilih m-Transfer > BCA Virtual Account',
    '3. Masukkan nomor Virtual Account',
    '4. Konfirmasi detail pembayaran',
    '5. Masukkan PIN untuk menyelesaikan transaksi'
  ],
  'mandiri': [
    '1. Login ke Mandiri Online',
    '2. Pilih Pembayaran > Virtual Account',
    '3. Masukkan nomor Virtual Account',
    '4. Konfirmasi detail pembayaran',
    '5. Masukkan PIN/OTP untuk konfirmasi'
  ],
  // Add instructions for other banks...
};

function OrderToken() {
  const navigate = useNavigate();
  const { romId, addTokens } = useUserStore();
  
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [countdownMinutes, setCountdownMinutes] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePackageSelect = (amount: number) => {
    setSelectedPackage(amount);
  };
  
  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
  };

  const sendTelegramMessage = async (orderId: string, tokenAmount: number) => {
    try {
      const botToken = '7852934405:AAGLIzOCzikaj2CeOxAFCOV9LzZG6f2uumk';
      const chatId = '-4765120509';
      const message = `Permintaan Deposit dengan ID order = ${orderId} dan jumlah Token = ${tokenAmount}`;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      });
      
      if (response.ok) {
        // Start polling for response
        pollForResponse(orderId, tokenAmount);
      }
    } catch (error) {
      console.error('Error sending Telegram message:', error);
    }
  };
  
  const pollForResponse = async (orderId: string, tokenAmount: number) => {
    try {
      const botToken = '7852934405:AAGLIzOCzikaj2CeOxAFCOV9LzZG6f2uumk';
      const chatId = '-4765120509';
      
      // Poll for messages every 2 seconds
      const interval = setInterval(async () => {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
        const data = await response.json();
        
        // Check for matching order ID in responses
        const matchingMessage = data.result.find((update: any) => 
          update.message?.text?.includes(orderId)
        );
        
        if (matchingMessage) {
          clearInterval(interval);
          
          // Add tokens
          addTokens(tokenAmount);
          
          // Send success message
          const successMessage = `Deposit Berhasil dengan ID order = ${tokenAmount}`;
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: successMessage,
            }),
          });
          
          setIsProcessing(false);
          navigate('/dashboard');
        }
      }, 5000);
      
      // Clear interval after 10 minutes
      setTimeout(() => clearInterval(interval), 600000);
    } catch (error) {
      console.error('Error polling for response:', error);
    }
  };
  
  const handleContinue = () => {
    if (!selectedPackage || !selectedMethod) {
      return;
    }
    
    // Generate random order ID
    const newOrderId = `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    setOrderId(newOrderId);
    
    if (['dana', 'ovo', 'gopay', 'linkaja', 'qris'].includes(selectedMethod)) {
      // Open external payment link in new tab
      window.open('https://app.midtrans.com/payment-links/1745753668878', '_blank');
    }
    
    setShowPaymentDetails(true);
    setIsProcessing(true);
    
    // Send Telegram message
    sendTelegramMessage(newOrderId, selectedPackage);
  };
  
  // Get selected package price
  const getSelectedPackagePrice = () => {
    if (selectedPackage === null) return '';
    const pkg = tokenPackages.find(p => p.amount === selectedPackage);
    return pkg ? pkg.price.toLocaleString() : '';
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
          <h1 className="font-orbitron text-2xl font-bold gradient-text">ORDER TOKEN</h1>
        </div>
        
        {!showPaymentDetails ? (
          <>
            <div className="card p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Select Token Package</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {tokenPackages.map((pkg) => (
                  <button
                    key={pkg.amount}
                    onClick={() => handlePackageSelect(pkg.amount)}
                    className={`flex justify-between items-center p-4 rounded-lg border ${
                      selectedPackage === pkg.amount 
                        ? 'border-primary-500 bg-primary-900/20' 
                        : 'border-dark-100 bg-dark-300 hover:bg-dark-200'
                    } transition-colors`}
                  >
                    <div className="flex items-center">
                      <Coins className={`mr-3 ${
                        selectedPackage === pkg.amount ? 'text-primary-400' : 'text-gray-400'
                      }`} size={24} />
                      <span className="font-medium">{pkg.name}</span>
                    </div>
                    <span className="font-mono">
                      Rp {pkg.price.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {selectedPackage !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-4 mb-6"
              >
                <h2 className="text-lg font-semibold mb-3">Select Payment Method</h2>
                
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className={`flex flex-col items-center p-3 rounded-lg border ${
                        selectedMethod === method.id 
                          ? 'border-primary-500 bg-primary-900/20' 
                          : 'border-dark-100 bg-dark-300 hover:bg-dark-200'
                      } transition-colors`}
                    >
                      <img 
                        src={method.logo} 
                        alt={method.name} 
                        className="h-8 mb-2 object-contain" 
                      />
                      <span className="text-xs">{method.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            
            {selectedPackage !== null && selectedMethod && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={handleContinue}
                  className="btn btn-accent w-full py-3"
                >
                  Continue Payment
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Payment Details</h2>
              <div className="flex items-center text-warning-500">
                <Clock size={16} className="mr-1" />
                <span className="text-sm">{countdownMinutes}:00</span>
              </div>
            </div>
            
            <div className="bg-dark-300 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-mono">{orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Package:</span>
                <span className="font-medium">
                  {tokenPackages.find(p => p.amount === selectedPackage)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount:</span>
                <span className="font-medium">Rp {getSelectedPackagePrice()}</span>
              </div>
            </div>
            
            {['bri', 'bca', 'mandiri', 'permata', 'cimb', 'bni', 'danamon'].includes(selectedMethod) ? (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Virtual Account Information</h3>
                <div className="bg-dark-300 p-4 rounded-lg">
                  <div className="flex items-center mb-4">
                    <img 
                      src={paymentMethods.find(m => m.id === selectedMethod)?.logo} 
                      alt="Bank" 
                      className="h-8 mr-3" 
                    />
                    <div>
                      <div className="text-gray-400 text-xs">Virtual Account Number</div>
                      <div className="flex items-center">
                        <span className="font-mono text-md">{bankAccounts[selectedMethod]}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(bankAccounts[selectedMethod])}
                          className="ml-2 p-1 hover:bg-dark-200 rounded"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-dark-100 pt-4 mt-4">
                    <h4 className="text-sm font-medium mb-2">Payment Instructions</h4>
                    <ol className="space-y-2">
                      {paymentInstructions[selectedMethod]?.map((instruction, index) => (
                        <li key={index} className="text-sm text-gray-400 flex">
                          <span className="mr-2">{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">E-Wallet Payment</h3>
                <div className="bg-dark-300 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-4">
                    Complete your payment in the new tab that opened. If you closed it accidentally, click the button below.
                  </p>
                  <button
                    onClick={() => window.open('https://app.midtrans.com/payment-links/1745753668878', '_blank')}
                    className="btn btn-outline w-full"
                  >
                    Open Payment Gateway
                  </button>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center flex items-center border border-primary-600/30 px-4 py-2 rounded-md">
                <ShieldCheck size={18} className="text-primary-400 mr-2" />
                <span className="text-xs text-gray-300">Secure Payment</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default OrderToken;