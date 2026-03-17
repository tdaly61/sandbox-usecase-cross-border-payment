import { alpha, Box, darken, styled } from '@mui/material';
import { BoxProps as MuiBoxProps } from '@mui/material/Box/Box';
import { useEffect, useState } from 'react';

import { LockScreen } from '@/components/ui/mobile-frame/lock-screen';
import { MessageApp } from '@/components/ui/mobile-frame/message-app';
import { useTransactionBroadcast } from '@/hooks/transaction-broadcast-state';
import { Log } from '@/types/api';

const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

const chassisColor = '#41729f';

const Frame = styled(Box)({
    background: '#000',
    borderTopLeftRadius: '60em',
    borderTopRightRadius: '60em',
    boxShadow: [
        `inset 0 0 1em 1em ${darken(chassisColor, 0.3)}`,
        '0em 0em 1em 2em rgba(255,255,255,1) inset',
        '0em 0em 1em 2em rgba(255,255,255,1) inset',
        `0em 0em 1em 5em ${alpha(chassisColor, 0.8)} inset`,
        '0px 35px 70px rgba(0,0,0,0.6) inset',
    ].join(','),
    height: '100%',
    padding: '11em 18em',
    width: '100%',
    marginBottom: '-25em',
    overflow: 'hidden',
});

const Screen = styled(Box)({
    background: '#000',
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    borderTopLeftRadius: '48em',
    borderTopRightRadius: '48em',
    position: 'relative',
    height: '386em',
    width: '316em',
    marginLeft: '-5em',
    marginTop: '1em',
    overflow: 'hidden',
});

const Antenna = styled(Box)({
    '&::after': {
        content: '""',
        position: 'absolute',
        border: `solid ${alpha('#fff', 0.2)}`,
        borderWidth: '0 5em',
        height: '5em',
        left: '0',
        width: '100%',
        top: '69em',
    },
});

const Header = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'hasMessage',
})<{ hasMessage: boolean }>(({ hasMessage }) => {
    const opacity = 0.5;
    const colorAlpha = hasMessage ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`;
    const color = hasMessage ? 'black' : 'white';

    return {
        height: '28em',
        position: 'absolute',
        top: '10em',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '15em',
        paddingRight: '15em',
        color: color,
        '& > *': {
            flex: 1,
        },
        '& .signal::before, .signal::after, & .signal .bar::before, & .signal .bar::after': {
            backgroundColor: color,
        },
        '& .battery': {
            borderColor: colorAlpha,
        },
        '& .battery::after': {
            backgroundColor: color,
        },
        '& .battery::before': {
            backgroundColor: colorAlpha,
        },
    };
});

const Island = styled(Box)({
    background: '#000',
    borderRadius: '18em',
    position: 'relative',
    '& .sensor-1::after, & .sensor-1::before': {
        content: '""',
        position: 'absolute',
    },
    '& .sensor-1::after': {
        background: '#444',
        borderRadius: '50%',
        height: '6em',
        width: '6em',
        right: '1%',
        marginRight: '15em',
        top: '10.5em',
        boxShadow: '0em 0em 2em 1em navy inset',
    },
    '& .sensor-1::before': {
        background: 'rgb(20,20,20)',
        borderRadius: '50%',
        height: '12em',
        width: '12em',
        right: '1%',
        marginRight: '12em',
        top: '8em',
    },
    '& .sensor-2::after, & .sensor-2::before': {
        content: '""',
        position: 'absolute',
    },
    '& .sensor-2::before': {
        background: '#131313',
        borderRadius: '1.5em',
        height: '3em',
        width: '40em',
        left: '50%',
        marginLeft: '-20em',
        top: '12em',
    },
});

const HeaderSide = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    color: 'inherit',
});

const CarrierTime = styled(Box)({
    color: 'inherit',
    fontSize: '14px',
    fontWeight: 500,
});

const Signal = styled(Box)({
    display: 'flex',
    width: '18px',
    height: '10px',
    position: 'relative',
    '&:before, &:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: '3px',
        borderRadius: '5px',
    },
    '&:before': {
        right: 0,
        height: '100%',
    },
    '&:after': {
        right: '4px',
        height: '80%',
    },
    '& .bar:before, & .bar:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: '3px',
        borderRadius: '5px',
        backgroundColor: 'white',
    },
    '& .bar:before': {
        right: '8px',
        height: '60%',
    },
    '& .bar:after': {
        right: '12px',
        height: '40%',
    },
});

const Data = styled(Box)({
    margin: '0 3px',
    color: 'inherit',
    fontSize: '12px',
    fontWeight: 600,
    textTransform: 'uppercase',
});

const Battery = styled(Box)({
    display: 'flex',
    width: '20px',
    height: '12px',
    borderRadius: '4px',
    border: '1px solid',
    position: 'relative',
    '&:before, &:after': {
        content: '""',
        position: 'absolute',
    },
    '&:before': {
        right: '-3px',
        width: '2px',
        top: '2.5px',
        height: '4px',
        borderTopRightRadius: '2px',
        borderBottomRightRadius: '2px',
    },
    '&:after': {
        left: '1px',
        top: '1px',
        width: '100%',
        height: '8px',
        borderRadius: '2px',
        maxWidth: 'calc(100% - 2px)',
        backgroundColor: 'white',
    },
});

const VolumeButton = styled(Box)({
    backgroundColor: chassisColor,
    boxShadow: [
        `inset 0 0 1em 0.5em ${darken(chassisColor, 0.7)}`,
        '0em 0em 3em 2em rgba(255,255,255,0.4) inset',
    ].join(','),
    borderTopLeftRadius: 1.5,
    borderBottomLeftRadius: 1.5,
    height: '26em',
    left: '-3em',
    position: 'absolute',
    top: '122em',
    width: '3em',
    '&::after, &::before': {
        content: '""',
        position: 'absolute',
        backgroundColor: chassisColor,
        boxShadow: [
            `inset 0 0 1em 0.5em ${darken(chassisColor, 0.7)}`,
            '0em 0em 3em 2em rgba(255,255,255,0.4) inset',
        ].join(','),
        borderTopLeftRadius: 1.5,
        borderBottomLeftRadius: 1.5,
        height: '50em',
        left: '0',
        width: '3em',
    },
    '&::after': { top: '48em' },
    '&::before': { top: '112em' },
});

const PowerButton = styled(Box)({
    backgroundColor: chassisColor,
    boxShadow: [
        `inset 0 0 1em 0.5em ${darken(chassisColor, 0.7)}`,
        '0em 0em 3em 2em rgba(255,255,255,0.4) inset',
    ].join(','),
    borderTopRightRadius: 1.5,
    borderBottomRightRadius: 1.5,
    height: '75em',
    right: '-3em',
    position: 'absolute',
    top: '175em',
    width: '3em',
});

const StyledMobilePhone = styled(Box)({
    position: 'relative',
    fontSize: `1px`,
    width: '342em',
});

type MobilePhoneProps = MuiBoxProps & {
    log?: Log;
};

export const MobilePhone = ({ log }: MobilePhoneProps) => {
    const [time, setTime] = useState(getCurrentTime());
    const [date, setDate] = useState(getCurrentDate());
    const { broadcastCompleted, log: globalLog } = useTransactionBroadcast();

    const logToDisplay = broadcastCompleted && globalLog
        ? globalLog
        : log;

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getCurrentTime());
            setDate(getCurrentDate());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <StyledMobilePhone>
            <Box sx={{ overflow: 'hidden' }}>
                <Frame>
                    <Screen>
                        <Header hasMessage={!!log}>
                            <HeaderSide>
                                <CarrierTime>{log ? time : 'GovStack'}</CarrierTime>
                            </HeaderSide>
                            <Island>
                                <span className="sensor-1" />
                                <span className="sensor-2" />
                            </Island>
                            <HeaderSide>
                                <Signal className="signal">
                                    <span className="bar" />
                                </Signal>
                                <Data>5g</Data>
                                <Battery className="battery" />
                            </HeaderSide>
                        </Header>
                        {logToDisplay ? <MessageApp log={logToDisplay} /> : <LockScreen time={time} date={date} />}
                    </Screen>
                    <Antenna />
                    <VolumeButton />
                    <PowerButton />
                </Frame>
            </Box>
        </StyledMobilePhone>
    );
};
