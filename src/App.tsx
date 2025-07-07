import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BackgroundScene from './components/BackgroundScene';
import LoadingScreen from './components/LoadingScreen';
import ThemeToggle from './components/ThemeToggle';
import useUserStore from './store/userStore';

// Lazy load routes for better performance
const LoginScreen = React.lazy(() => import('./pages/LoginScreen'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ServerControl = React.lazy(() => import('./pages/ServerControl'));
const Deposit = React.lazy(() => import('./pages/Deposit'));
const Withdraw = React.lazy(() => import('./pages/Withdraw'));
const HighLowGame = React.lazy(() => import('./pages/games/HighLowGame'));
const WinGoGame = React.lazy(() => import('./pages/games/WinGoGame'));
const TokenConvert = React.lazy(() => import('./pages/TokenConvert'));
const OrderToken = React.lazy(() => import('./pages/OrderToken'));

function App() {
  const theme = useUserStore((state) => state.theme);

  return (
    <div className={`min-h-screen overflow-x-hidden font-inter text-white relative ${
      theme === 'light' ? 'bg-gray-50' : 'bg-black'
    }`}>
      {/* 3D Background Scene */}
      <BackgroundScene />
      
      {/* Theme Toggle */}
      <ThemeToggle />
      
      {/* Routes */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/server-control" element={<ServerControl />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/highlow" element={<HighLowGame />} />
          <Route path="/wingo" element={<WinGoGame />} />
          <Route path="/convert" element={<TokenConvert />} />
          <Route path="/order" element={<OrderToken />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;