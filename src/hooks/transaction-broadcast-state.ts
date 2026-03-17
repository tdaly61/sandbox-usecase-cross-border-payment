import { create } from 'zustand';

type Log = {
    id: number;
    broadcast: string;
    content: string;
    processed: boolean;
    receiver: string;
    sender: string | null;
    timestamp: string;
};

type TransactionBroadcastState = {
    broadcastCompleted: boolean;
    log?: Log;
    setBroadcastCompleted: (completed: boolean, log?: Log) => void;
};

export const useTransactionBroadcast = create<TransactionBroadcastState>((set) => ({
    broadcastCompleted: false,
    log: undefined,
    setBroadcastCompleted: (completed, log) => set({ broadcastCompleted: completed, log }),
}));
