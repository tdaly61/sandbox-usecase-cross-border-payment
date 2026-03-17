import { Box, Button, Divider, Icon, IconButton, Typography } from '@mui/material';
import React, { use, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { MobilePhone } from '@/components/ui/mobile-frame/mobile-frame';
import { paths } from '@/config/paths';
import { logViewerWidth } from '@/config/theme';
import { useCreateBroadcast } from '@/features/broadcast/api/create-broadcast';
import { useTransactions } from '@/features/transactions/api/get-transactions';
import { Log } from '@/types/api';
import { LogsView } from '../log-viewer/components/logs-view';
import { useTransactionBroadcast } from '@/hooks/transaction-broadcast-state';

type LogViewerProps = {
    toggleLogViewer: () => void;
};

export const LogViewer = ({ toggleLogViewer }: LogViewerProps) => {
    const [transactionID, setTransactionID] = useState<string | null>(null);
    const [state, setState] = useState<string>('');
    const [finalLog, setFinalLog] = useState<Log>();
    const broadcastId = "";
    const { broadcastCompleted, log } = useTransactionBroadcast();

    const getStatusMessage = () => {
        if (!transactionID && !log?.processed) {
            return "User hasn't received a message yet.";
        }
        if (log?.processed) {
            return 'Funds have been received successfully.';
        }
        return 'Broadcast is sent!<br />User has received the message.';
    };

    useEffect(() => {
        if (broadcastCompleted && log) {
            // Ensure sender is always a string
            setFinalLog({
                ...log,
                sender: log.sender ?? '',
            });
        } else {
            setFinalLog(undefined);
        }
    }, [broadcastCompleted, log]);



    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#1A1A1A',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    color: 'white',
                    minHeight: 48,
                    py: 1,
                    px: 1.5,
                    borderBottom: '1px solid rgba(235, 249, 255, 0.60)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography
                    color="inherit"
                    fontFamily="Roboto Mono"
                    fontWeight={700}
                    letterSpacing={0.4}
                    textTransform="uppercase"
                >
                    Broadcast Logs
                </Typography>
                <IconButton sx={{ color: 'inherit', p: 0.5 }} onClick={toggleLogViewer}>
                    <Icon baseClassName="material-symbols-outlined">close</Icon>
                </IconButton>
            </Box>

            {/* Status message & logs area */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Status Message */}


                {/* Logs area (scrollable) */}
                <Box
                    sx={{
                        flexGrow: 1,
                        px: 1.5,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                        color: 'white',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        minHeight: 120,
                        pb: 3, // make space for the phone footer
                    }}
                >
                    {broadcastId ? (
                        <LogsView broadcastId={broadcastId} setFinalLog={setFinalLog} />
                    ) : (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1.5,
                                justifyContent: 'center',
                                alignItems: 'center',
                                pt: 2,
                            }}
                        >
                            {/* --- New yellow warning card --- */}
                            <Box
                                sx={{
                                    background: 'rgba(251, 192, 45, 0.14)', // soft yellow
                                    border: '1.5px solid #fbc02d',
                                    borderRadius: 2,
                                    p: 2.5,
                                    maxWidth: 380,
                                    minWidth: 280,
                                    boxShadow: '0 2px 16px 0 #fbc02d22',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <Icon
                                    baseClassName="material-symbols-outlined"
                                    sx={{
                                        color: '#fbc02d',
                                        fontSize: 38,
                                        mb: 1,
                                    }}
                                >
                                    warning
                                </Icon>
                                {!finalLog ? (<><Typography
                                    fontFamily="Roboto Mono"
                                    fontSize={16}
                                    fontWeight={700}
                                    letterSpacing={0.25}
                                    textTransform="uppercase"
                                    sx={{ color: '#fbc02d', mb: 0.5, textAlign: 'center' }}
                                >
                                    TRANSACTION NOT INITIATED
                                </Typography>

                                </>
                                ) : <Typography
                                    fontFamily="Roboto Mono"
                                    fontSize={16}
                                    fontWeight={700}
                                    letterSpacing={0.25}
                                    textTransform="uppercase"
                                    sx={{ color: '#fbc02d', mb: 0.5, textAlign: 'center' }}
                                >
                                    TRANSACTION INITIATED
                                </Typography>}
                            </Box>
                            {!finalLog && <Typography
                                color="inherit"
                                fontFamily="Roboto Mono"
                                fontSize={14}
                                textTransform="uppercase"
                                lineHeight={1.5}
                                sx={{
                                    wordBreak: 'break-word',
                                    whiteSpace: 'normal',
                                    width: '100%',            // Fills all horizontal space
                                    textAlign: "center",       // Aligns text to the right edge
                                }}
                            >
                                To see the logs, please initiate a transaction.
                            </Typography>}
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'block',  // or flex, doesn't matter as long as width is 100%
                                }}
                            >
                                <Typography
                                    color="inherit"
                                    fontFamily="Roboto Mono"
                                    fontSize={12}
                                    letterSpacing={0.5}
                                    textTransform="uppercase"
                                    lineHeight={1.5}
                                    sx={{
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                        width: '100%',            // Fills all horizontal space
                                        textAlign: "left",       // Aligns text to the right edge
                                    }}
                                >
                                    This log viewer shows the technical flow of your transaction across different GovStack
                                    Building Blocks and services. Initiate a transaction to see real-time system
                                    interactions and message delivery progress.
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    px: 3,
                                    pt: 3,
                                    pb: 1.5,
                                }}
                            >
                                <Typography
                                    color="white"
                                    fontFamily="Roboto Mono"
                                    fontSize={14}
                                    letterSpacing={0.25}
                                    textTransform="uppercase"
                                    lineHeight={1.6}
                                    sx={{
                                        wordBreak: 'break-word',
                                        whiteSpace: 'normal',
                                        maxWidth: logViewerWidth - 60,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        background: 'rgba(255,255,255,0.08)',
                                        p: 2,
                                        boxShadow: '0 2px 16px 0 #2e4739a0',
                                    }}
                                    dangerouslySetInnerHTML={{ __html: getStatusMessage() }}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Footer: MobilePhone stays at the bottom */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    pb: 2,
                    background: 'transparent',
                }}
            >
                <MobilePhone log={finalLog} />
            </Box>
        </Box>
    );
};
