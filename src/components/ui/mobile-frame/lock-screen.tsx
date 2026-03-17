import { Box } from '@mui/material';
import React from 'react';

import lockscreenBgImage from '@/assets/lockscreen-bg-image.jpg';
import lockscreenBgVideo from '@/assets/lockscreen-bg-video.mp4';

export const LockScreen = ({ time, date }: { time: string; date: string }) => {
    return (
        <>
            <video
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                src={lockscreenBgVideo}
                poster={lockscreenBgImage}
                autoPlay
                loop
                muted
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: 70,
                    width: '100%',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    transition: 'ease all 0.4s',
                    color: 'rgba(255, 255, 255, 0.8)',
                }}
            >
                <Box sx={{ fontSize: '14px', fontWeight: 700 }}>{date}</Box>
                <Box sx={{ fontSize: '60px', fontWeight: 700, lineHeight: 1 }}>{time}</Box>
            </Box>
        </>
    );
};
