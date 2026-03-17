import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    styled
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useTransactionBroadcast } from '@/hooks/transaction-broadcast-state';
import TransactionFinalStatus from "./transaction-final-status";
import { InitiatedTransaction } from "@/types/api";
import { useInitiatedTransactions } from "@/hooks/initiated-transactions";
import { convertZWGtoZAR, getFeeAmount, getFXRateZWGFtoZAR } from "@/utils/transactionConversions";
import { getFXRateZWGtoUSD, getFXRateUSDtoZAR, getTransactionFeeAmount } from "@/utils/transactionConversions";
import { get } from "http";

// Helper: Check if a number is prime
const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) return false;
    }
    return true;
};

const steps = [
    "Originating Bank",
    "Mastercard Network",
    "Destination Bank",
    "Funds Received",
    ""
];

import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector";
import { CallReceivedTwoTone } from "@mui/icons-material";

const CustomConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22, // aligns line with step circle
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
        borderColor: "#0fb0efff", // ✅ blue when step is active
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
        borderColor: "#4caf50", // ✅ green when step is completed
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: "#ccc",  // default gray
        borderTopWidth: 2,
        borderRadius: 1,
        transition: "border-color 0.3s ease", // smooth transition
    },
}));

const StatusBox = styled(Box)<{ active?: boolean; completed?: boolean }>(
    ({ active, completed }) => ({
        p: 2,
        mt: 1,
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        backgroundColor: "#fafafa",
        boxShadow: completed
            ? "0 0 12px rgba(76, 175, 80, 0.6)" // ✅ Green glow when completed
            : active
                ? "0 0 12px rgba(15, 176, 239, 0.6)" // 🔵 Blue glow when active
                : "0 1px 3px rgba(0, 0, 0, 0.1)", // ⚪ Default light shadow
        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
        minWidth: 180,
        minHeight: 162,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        borderColor: completed ? "#4caf50" : active ? "#0fb0efff" : "#e0e0e0",
    })
);

interface TransactionRoadMapProps {
    propTransaction?: InitiatedTransaction;
    compact?: boolean;
}

export const TransactionRoadmap = ({ propTransaction, compact = false }: TransactionRoadMapProps) => {

    const location = useLocation();
    const navigate = useNavigate();
    const transaction = propTransaction || location.state || {};
    const transactionBroadcast = useTransactionBroadcast();
    const { addTransaction } = useInitiatedTransactions(); // <-- GET IT HERE

    const [stepIndex, setStepIndex] = useState(0);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);
    const [status, setStatus] = useState<boolean | undefined>(undefined);
    const [txAdded, setTxAdded] = useState(false); // Prevent adding duplicate transactions
    const [initiated, setInitiated] = useState(false);
    const [showFinal, setShowFinal] = useState(false);  // ✅ NEW
    const [initiatedTx, setInitiatedTx] = useState<InitiatedTransaction | null>(null);
    //const num = Math.floor(Math.random() * 99) + 2;
    const num = 2;
    const duration = 20; // or measure time7

    useEffect(() => {
        const execDate = new Date().toISOString();
        // Just for demo, let's say process took 20s (replace with your actual duration)

        // Build InitiatedTransaction object
        const initiatedTx: InitiatedTransaction = {
            payeeIdentity: transaction.payeeIdentity ?? "no identity",
            payee: transaction.payee ?? "",
            duration,
            executionDate: execDate,
            fromBank: "Standard Bank of Zimbabwe (ZWG)",
            toBank: "Standard Bank of South Africa (ZAF)",
            transactionFee: getFeeAmount(),
            fxRateToUSD: getFXRateZWGtoUSD(),
            fxRateToZar: getFXRateUSDtoZAR(),
            amountSent: transaction.amountSent ?? 0,
            amountReceived: transaction.amountReceived ?? 0,
            status: "COMPLETED",
        };
        setInitiatedTx(initiatedTx);   // ✅ save it globally
        if (stepIndex === steps.length - 1 && randomNumber === null) { // only do this if not done already
            setRandomNumber(num);
            setStatus(isPrime(num));

            // Update global store for broadcast
            transactionBroadcast.setBroadcastCompleted(isPrime(num), {
                id: 21,
                broadcast: "baf6c711-4858-484e-a7a5-23661a219cce",
                content: "Payment completed successfully. You have received your funds.".concat(" ", initiatedTx?.amountReceived.toLocaleString(undefined, {
                    style: "currency",
                    currency: "ZAR",
                })),
                processed: isPrime(num),
                receiver: "mobile",
                sender: null,
                timestamp: new Date().toISOString(),
            });

            // --- ADD TRANSACTION ONLY IF PRIME ---
            if (isPrime(num) && !txAdded) {
                const execDate = new Date().toISOString();
                // Just for demo, let's say process took 20s (replace with your actual duration)

                setInitiatedTx(prev => prev ? { ...prev, status: "COMPLETED" } : prev);  // ✅ update status only
                addTransaction({ ...initiatedTx!, status: "COMPLETED" });
                setTxAdded(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stepIndex, randomNumber]);

    useEffect(() => {
        if (initiated && stepIndex < steps.length - 1) {
            const interval = setInterval(() => {
                setStepIndex((prev) => {
                    if (prev < steps.length - 1) {
                        return prev + 1;
                    }
                    return prev;
                });
            }, 4000); // every 4 seconds
            return () => clearInterval(interval);
        }
    }, [initiated, stepIndex]);

    // ✅ When last step completes, wait 2s then show TransactionFinalStatus
    useEffect(() => {
        if (stepIndex === steps.length - 1 && initiated) {
            const timer = setTimeout(() => {
                setShowFinal(isPrime(num));
                setStatus(true); // Or calculate prime check if needed
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [stepIndex, initiated]);

    const handleInitiate = () => {


        setInitiated(true);
        setStepIndex(0);      // Reset for fresh run
        setShowFinal(false);  // Hide final until completed
    };

    const handleRefresh = () => {
        setStepIndex(0);
        setInitiated(false);
        setRandomNumber(null);
        setStatus(undefined);
        setTxAdded(false); // reset for possible next transaction
        transactionBroadcast.setBroadcastCompleted(false, {
            id: 0,
            broadcast: "",
            content: "",
            processed: false,
            receiver: "",
            sender: null,
            timestamp: ""
        }); // Reset broadcast state
    };

    if (!transaction || !transaction.fromBank) {
        return <Typography>No transaction data.</Typography>;
    }


    return (
        <Box
            minHeight={compact ? "auto" : "80vh"}   // 👈 remove tall height in batch mode
            display="flex"
            alignItems={compact ? "flex-start" : "center"}  // 👈 no vertical centering
            justifyContent="center"
            sx={{ mb: 1 }} // small bottom margin between cards
        >
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 8px 40px 0 #44b9efcc",
                    width: 900,
                    maxWidth: "95vw",
                    position: "relative",
                }}
            ><Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h5" mb={2} color="#555656ff" fontWeight={800}>
                        Payment Details
                    </Typography>
                    <Box display="flex" gap={2}>
                        {!initiated && <Button
                            variant="contained"
                            color="error"
                            onClick={() => {
                                transactionBroadcast.setBroadcastCompleted(false, undefined);
                                navigate("/"); // ✅ send user back to dashboard or transactions list
                            }}
                        >
                            Cancel
                        </Button>}

                        {!initiated && (
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleInitiate}
                            >
                                Initiate Payment
                            </Button>
                        )}
                    </Box>
                </Box>
                {!showFinal && (
                    <Stepper
                        activeStep={initiated ? stepIndex : -1}
                        alternativeLabel
                        connector={<CustomConnector />}
                        sx={{
                            mb: 4,
                            "& .MuiStepLabel-label": { mt: 1, fontWeight: 600 },
                            "& .MuiStepIcon-root": {
                                color: "#e0e0e0", // grey inactive
                                fontSize: "2rem",
                                "&.Mui-active": { color: "#0fb0efff" },
                                "&.Mui-completed": { color: "#4caf50" }
                            }
                        }}
                    >
                        <Step completed={initiated && stepIndex > 0}>
                            <StepLabel>
                                <StatusBox
                                    active={initiated && stepIndex === 0}      // 🔵 Glow while active
                                    completed={initiated && stepIndex > 0}     // ✅ Green after completion
                                >
                                    <Typography fontWeight={600}>From:</Typography>
                                    <Typography>{initiatedTx?.fromBank}</Typography>
                                    <Typography fontWeight={600} mt={1}>Sent Amount:</Typography>
                                    <Typography> {initiatedTx?.amountSent.toLocaleString(undefined, {
                                        style: "currency",
                                        currency: "ZWG",
                                        minimumFractionDigits: 2,
                                    })}</Typography>
                                </StatusBox>
                            </StepLabel>
                        </Step>

                        <Step completed={initiated && stepIndex > 1}>
                            <StepLabel>
                                <StatusBox
                                    active={initiated && stepIndex === 1}      // 🔵 Glow while active
                                    completed={initiated && stepIndex > 1}     // ✅ Green after completion
                                >
                                    <Typography fontWeight={600} sx={{ fontSize: "20px" }}>Via Mastercard</Typography>
                                    <Typography mt={0.5} sx={{ fontSize: "12px" }}>Transaction FEE:</Typography>
                                    <Typography fontWeight={600}>{getFeeAmount().toLocaleString(undefined, {
                                        style: "currency",
                                        currency: "ZWG",
                                        minimumFractionDigits: 2,
                                    })}</Typography>
                                </StatusBox>
                            </StepLabel>

                        </Step>

                        <Step completed={initiated && stepIndex > 2}>
                            <StepLabel>
                                <StatusBox
                                    active={initiated && stepIndex === 2}      // 🔵 Glow while active
                                    completed={initiated && stepIndex > 2}     // ✅ Green after completion
                                >
                                    <Typography fontWeight={600}>To:</Typography>
                                    <Typography>{initiatedTx?.toBank}</Typography>
                                    <Typography fontWeight={600} mt={1}>Received Amount:</Typography>
                                    <Typography>  {initiatedTx?.amountReceived.toLocaleString(undefined, {
                                        style: "currency",
                                        currency: "ZAR",
                                        minimumFractionDigits: 2,
                                    })}</Typography>
                                </StatusBox>
                            </StepLabel>
                        </Step>

                        <Step completed={initiated && stepIndex > 3}>
                            <StepLabel>
                                <StatusBox
                                    active={initiated && stepIndex === 3}      // 🔵 Glow while active
                                    completed={initiated && stepIndex > 3}     // ✅ Green after completion
                                >
                                    <Typography fontWeight={600}>Funds Received by:</Typography>
                                    <Typography>{initiatedTx?.payee}</Typography>
                                </StatusBox>
                            </StepLabel>
                        </Step>
                    </Stepper>
                )}

                {/* ✅ After final step completed, show TransactionFinalStatus */}
                {showFinal && (
                    <TransactionFinalStatus
                        status={status}
                        payee={transaction.payee}

                        transaction={{
                            amount: initiatedTx?.amountReceived.toLocaleString(undefined, {
                                style: "currency",
                                currency: "ZAR",
                                minimumFractionDigits: 2,
                            }) || "0.00",
                            currency: "ZAR", // Assuming ZAR for final amount
                        }}
                        randomNumber={randomNumber ?? undefined}
                        handleRefresh={handleRefresh}
                    />
                )}
            </Paper>
        </Box>
    );
};
