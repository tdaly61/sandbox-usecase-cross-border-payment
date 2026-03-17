import { Box, Icon, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useLog } from '@/features/log-viewer/api/get-logs';
import { Log } from '@/types/api';

type LogEventsProps = {
    broadcastId: string;
    setFinalLog: Dispatch<SetStateAction<Log | undefined>>;
};

const formatLogTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
        timeZoneName: 'short',
    };
    return date.toLocaleString('en-GB', options).replace(', ', ' ');
};

const senderMap: { [key: string]: { icon: string; size?: number; color?: string } } = {
    Initial: { icon: 'circle', size: 20, color: '#00FFF1' },
    'Threat Service': { icon: 'deployed_code' },
    'User Service': { icon: 'deployed_code' },
    'Information Mediator BB': { icon: 'lan' },
    'Messaging BB': { icon: 'sms' },
    Final: { icon: 'check_circle', size: 20, color: '#00FFF1' },
};

const getSenderIcon = (sender: string) => {
    const { icon, size, color } = senderMap[sender] || { icon: 'Unknown' };

    return (
        <Icon
            baseClassName="material-symbols-outlined"
            sx={{
                fontSize: size ?? 22,
                color: color ?? 'inherit',
            }}
        >
            {icon}
        </Icon>
    );
};

export const LogsView = ({ broadcastId, setFinalLog }: LogEventsProps) => {
    const { logs } = useLog({ broadcastId, setFinalLog });
    const location = useLocation();

    const logsEndRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const userScrolled = useRef(false);
    const prevLocation = useRef(location);

    const scrollToBottom = () => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (!userScrolled.current) {
            scrollToBottom();
        }
    }, [logs]);

    useEffect(() => {
        if (prevLocation.current !== location && logs.length >= 2) {
            setFinalLog(undefined);
        }
        prevLocation.current = location;
    }, [location, logs, setFinalLog]);

    useEffect(() => {
        const logEntries = document.querySelectorAll('.log-entry');
        logEntries.forEach((entry) => {
            entry.classList.add('log-entry-enter');
        });
    }, [logs]);

    const handleScroll = () => {
        if (containerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            userScrolled.current = scrollTop + clientHeight < scrollHeight;
        }
    };

    return (
        <Box
            ref={containerRef}
            onScroll={handleScroll}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                overflowY: 'auto',
                overflowX: 'hidden',
            }}
        >
            {logs.map((log, index) => (
                <Box
                    key={index}
                    className="log-entry"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                        opacity: 0,
                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                        '&.log-entry-enter': {
                            opacity: 1,
                            transform: 'translateY(0)',
                        },
                        '&:first-of-type': {
                            marginTop: 'auto',
                        },
                    }}
                >
                    <Box
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 24 }}
                    >
                        {getSenderIcon(log.sender)}
                        {log.sender !== 'Final' && (
                            <Box
                                sx={{
                                    width: '1px',
                                    height: '100%',
                                    backgroundColor: '#EBF9FF',
                                    marginTop: '3px',
                                }}
                            />
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.2 }}>
                        {log.sender === 'Initial' || log.sender === 'Final' ? (
                            <Typography
                                color={'#00FFF1'}
                                fontFamily="Roboto Mono"
                                fontSize={12}
                                fontWeight={700}
                                letterSpacing={0.15}
                                textTransform="uppercase"
                                lineHeight={1.5}
                            >
                                {log.content}
                            </Typography>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                                    <Typography
                                        color={'rgba(235, 249, 255, 0.54)'}
                                        fontFamily={'Roboto Mono'}
                                        fontSize={12}
                                        fontWeight={700}
                                        letterSpacing={0.15}
                                        textTransform={'uppercase'}
                                        lineHeight={1.5}
                                    >
                                        From
                                    </Typography>
                                    <Typography
                                        color={log.sender?.includes('BB') ? '#00FFF1' : '#EBF9FF'}
                                        fontFamily="Roboto Mono"
                                        fontSize={12}
                                        fontWeight={700}
                                        letterSpacing={0.15}
                                        textTransform="uppercase"
                                        lineHeight={1.5}
                                    >
                                        {log.sender}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
                                    <Typography
                                        color={'rgba(235, 249, 255, 0.54)'}
                                        fontFamily={'Roboto Mono'}
                                        fontSize={12}
                                        fontWeight={700}
                                        letterSpacing={0.15}
                                        textTransform={'uppercase'}
                                        lineHeight={1.5}
                                    >
                                        To
                                    </Typography>
                                    <Typography
                                        color={log.receiver?.includes('BB') ? '#00FFF1' : '#EBF9FF'}
                                        fontFamily="Roboto Mono"
                                        fontSize={12}
                                        fontWeight={700}
                                        letterSpacing={0.15}
                                        textTransform="uppercase"
                                        lineHeight={1.5}
                                    >
                                        {log.receiver}
                                    </Typography>
                                </Box>
                                <Typography
                                    color="#EBF9FF"
                                    fontFamily="Roboto Mono"
                                    fontSize={12}
                                    letterSpacing={0.15}
                                    lineHeight={1.5}
                                    whiteSpace={'pre-wrap'}
                                >
                                    {log.content}
                                </Typography>
                            </>
                        )}
                        <Typography
                            color="#EBF9FF"
                            fontFamily="Roboto Mono"
                            fontSize={10}
                            letterSpacing={0.15}
                            textTransform="uppercase"
                            lineHeight={1.5}
                            sx={{ mb: 1 }}
                        >
                            [{formatLogTimestamp(log.timestamp)}]
                        </Typography>
                    </Box>
                </Box>
            ))}
            <div ref={logsEndRef} />
        </Box>
    );
};
