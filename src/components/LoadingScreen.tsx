import React from 'react';
import { Loader, Zap } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-500 z-50">
      <div className="relative">
        <Zap 
          size={60} 
          className="text-primary-400 animate-pulse mb-4" 
        />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <Zap 
            size={60} 
            className="text-primary-600 animate-ping-slow opacity-75" 
          />
        </div>
      </div>
      
      <h1 className="font-orbitron text-2xl font-bold mb-4 text-white gradient-text">
        LOADING SYSTEM
      </h1>
      
      <div className="relative h-1 w-64 bg-dark-300 rounded-full overflow-hidden">
        <div className="absolute h-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-pulse-slow rounded-full" style={{ width: '100%', transform: 'translateX(-50%)', animation: 'loading 2s infinite' }}></div>
      </div>
      
      <div className="mt-8 flex items-center">
        <Loader className="animate-spin mr-2 text-primary-400" />
        <p className="text-primary-300 font-mono">Connecting to secure server...</p>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;