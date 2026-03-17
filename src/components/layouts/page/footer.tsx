import { Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Typography sx={{ color: '#0fb0efff', textAlign: 'center', fontSize: 12 }}>
      <a
        href="https://govstack.gitbook.io/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: '#0fb0efff' }}
      >
        Apache 2.0 licensed Cross Border MM Integration Prototype of GovStack
      </a>
    </Typography>
  );
};
