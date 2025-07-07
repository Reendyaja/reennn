import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userId: string;
  romId: string;
  tokenBalance: number;
  balance: number;
  isAuthenticated: boolean;
  transactions: Transaction[];
  usedBonusCodes: string[];
  ipAddress: string | null;
  theme: 'dark' | 'light';
  
  setUserId: (id: string) => void;
  setRomId: (id: string) => void;
  addTokens: (amount: number) => void;
  subtractTokens: (amount: number) => void;
  addBalance: (amount: number) => void;
  subtractBalance: (amount: number) => void;
  setAuthenticated: (status: boolean) => void;
  addTransaction: (transaction: Transaction) => void;
  redeemToken: (tokenId: string) => boolean;
  setIpAddress: (ip: string) => void;
  redeemBonusCode: (code: string) => boolean;
  toggleTheme: () => void;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'win' | 'loss' | 'convert' | 'bonus';
  amount: number;
  timestamp: Date;
  description?: string;
}

// Generate a random user ID
const generateUserId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate a random ROM ID
const generateRomId = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: generateUserId(),
      romId: generateRomId(),
      tokenBalance: 0,
      balance: 0,
      isAuthenticated: false,
      transactions: [],
      usedBonusCodes: [],
      ipAddress: null,
      theme: 'dark',
      
      setUserId: (id) => set({ userId: id }),
      
      setRomId: (id) => set({ romId: id }),
      
      addTokens: (amount) => set((state) => ({ 
        tokenBalance: state.tokenBalance + amount,
        transactions: [
          {
            id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'convert',
            amount: amount,
            timestamp: new Date(),
            description: `Added ${amount} tokens`
          },
          ...state.transactions
        ]
      })),
      
      subtractTokens: (amount) => set((state) => ({ 
        tokenBalance: Math.max(0, state.tokenBalance - amount) 
      })),
      
      addBalance: (amount) => set((state) => ({ 
        balance: state.balance + amount,
        transactions: [
          {
            id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: 'deposit',
            amount: amount,
            timestamp: new Date(),
            description: `Added Rp ${amount.toLocaleString()}`
          },
          ...state.transactions
        ]
      })),
      
      subtractBalance: (amount) => set((state) => {
        const newBalance = Math.max(0, state.balance - amount);
        return {
          balance: newBalance,
          transactions: amount > 0 ? [
            {
              id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
              type: 'withdraw',
              amount: amount,
              timestamp: new Date(),
              description: `Withdrew Rp ${amount.toLocaleString()}`
            },
            ...state.transactions
          ] : state.transactions
        };
      }),
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
      addTransaction: (transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      redeemToken: (tokenId) => {
        if (tokenId && tokenId.length >= 4) {
          set((state) => ({ 
            tokenBalance: state.tokenBalance + 5,
            transactions: [
              {
                id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                type: 'convert',
                amount: 5,
                timestamp: new Date(),
                description: `Redeemed token ${tokenId}`
              },
              ...state.transactions
            ]
          }));
          return true;
        }
        return false;
      },

      setIpAddress: (ip) => set({ ipAddress: ip }),

      redeemBonusCode: (code) => set((state) => {
        if (code === 'BFA404' && !state.usedBonusCodes.includes(code)) {
          return {
            balance: state.balance + 30000,
            usedBonusCodes: [...state.usedBonusCodes, code],
            transactions: [
              {
                id: `t-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                type: 'bonus',
                amount: 30000,
                timestamp: new Date(),
                description: 'Welcome bonus redeemed'
              },
              ...state.transactions
            ]
          };
        }
        return state;
      }),

      toggleTheme: () => set((state) => ({
        theme: state.theme === 'dark' ? 'light' : 'dark'
      }))
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        userId: state.userId,
        romId: state.romId,
        tokenBalance: state.tokenBalance,
        balance: state.balance,
        transactions: state.transactions,
        usedBonusCodes: state.usedBonusCodes,
        ipAddress: state.ipAddress,
        theme: state.theme
      })
    }
  )
);

export default useUserStore;