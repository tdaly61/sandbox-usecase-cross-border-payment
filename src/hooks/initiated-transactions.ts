// hooks/useInitiatedTransactions.ts
import { create } from 'zustand';
import { InitiatedTransaction } from '@/types/api';

type Store = {
  transactionsInitiated: InitiatedTransaction[];
  addTransaction: (tx: InitiatedTransaction) => void;
};

export const useInitiatedTransactions = create<Store>((set) => ({
  transactionsInitiated: [],
  addTransaction: (tx) => set((state) => ({ transactionsInitiated: [tx, ...state.transactionsInitiated] })),
}));
