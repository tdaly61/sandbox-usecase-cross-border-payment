import { Avatar, Box, Icon, styled, Typography } from '@mui/material';
import React from 'react';


// import { Log } from '@/types/api';

type Log = {
    id: number;
    broadcast: string;
    content: string;
    processed: boolean;
    receiver: string;
    sender: string | null;
    timestamp: string;
};

type MessageAppProps = {
    log: Log;
};

const Bubble = styled(Box)({
    marginLeft: '5px',
    marginRight: 'auto',
    maxWidth: '70%',
    backgroundColor: '#e9e9eb',
    position: 'relative',
    borderRadius: '20px',
    padding: '8px 15px',
    marginTop: '5px',
    marginBottom: '5px',
    color: 'black',
    fontSize: '13px',
    fontWeight: 400,
    whiteSpace: 'pre-wrap',

    '&:before': {
        content: '""',
        position: 'absolute',
        zIndex: 0,
        bottom: 0,
        left: '-7px',
        height: '20px',
        width: '20px',
        background: '#eee',
        borderBottomRightRadius: '15px',
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        left: '-10px',
        width: '10px',
        height: '20px',
        background: 'white',
        borderBottomRightRadius: '10px',
    },
});

const formatLogTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleTimeString('en-GB', options);
};

export const MessageApp = ({ log }: MessageAppProps) => {

    return (
        <Box
            sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                fontSize: '16px',
            }}
        >
            <Box
                sx={{
                    height: '114px',
                    width: '100%',
                    backgroundColor: '#f7f7f7',
                    borderBottom: '1px solid #e5e5e5',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingTop: '48px',
                }}
            >
                <Box sx={{ position: 'absolute', left: '16px', mt: 1 }}>
                    <Icon
                        baseClassName="material-symbols-outlined"
                        sx={{ color: '#1777fd', mr: 1, fontSize: '20px' }}
                    >
                        arrow_back_ios
                    </Icon>
                </Box>
                <Box
                    sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        sx={{
                            background: 'linear-gradient(180deg, #a3a8b6 20%, #888c96 100%)',
                            fontWeight: 500,
                        }}
                    >
                        ZPS
                    </Avatar>
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 1 }}>
                        <Typography fontSize={9} lineHeight={1} color={'#4a4a4a'}>
                            Zimbabwean Pension Scheme
                        </Typography>
                        <Icon
                            baseClassName="material-symbols-outlined"
                            sx={{ fontSize: '9px', color: '#b8b8b8' }}
                        >
                            arrow_forward_ios
                        </Icon>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    backgroundColor: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.3,
                    p: 1,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '10px',
                    }}
                >
                    <Typography fontWeight={500} color={'rgba(0, 0, 0, 0.50)'} fontSize={'inherit'}>
                        Today
                    </Typography>
                    <Typography color={'rgba(0, 0, 0, 0.50)'} fontSize={'inherit'}>
                        {log ? formatLogTimestamp(log.timestamp) : ''}
                    </Typography>
                </Box>
                <Bubble>
                    {log
                        ? log.content // Show your broadcast log
                        : log || log || "No broadcast yet"}
                </Bubble>
            </Box>
        </Box>
    );
};
