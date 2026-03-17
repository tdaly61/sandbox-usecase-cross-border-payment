import { Grid2, Typography, useMediaQuery, useTheme } from '@mui/material';
import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import loginOverlay from '@/assets/login-overlay.svg';
import { Footer } from '@/components/layouts/page/footer';
import { Head } from '@/components/seo';
import { paths } from '@/config/paths';
import { useUser } from '@/lib/auth';

type LayoutProps = {
  children: React.ReactNode;
  title: string;
};

export const AuthLayout = ({ children, title }: LayoutProps) => {
  const user = useUser();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const navigate = useNavigate();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  useEffect(() => {
    if (user.data && Object.keys(user.data).length > 0) {
      navigate(redirectTo ?? paths.app.dashboard.getHref(), {
        replace: true,
      });
    }
  }, [user.data, navigate, redirectTo]);
  return (
    <>
      <Head title={title} />
      <Grid2 container sx={{ minHeight: '100vh', backgroundColor: '#0359f7ff', }}> {/*65D243 */}
        {isLargeScreen && (
          <Grid2
            container
            spacing={0}
            direction="column"
            justifyContent="center"
            sx={{
              minHeight: '100vh', // ← THIS is critical!
              backgroundImage: `url(${loginOverlay})`,
              backgroundColor: '#0359f7ff',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              padding: 3,
            }}
            size={{ xs: 0, md: 3 }}
          >
            <Typography
              sx={{
                color: '#FFF',
                fontSize: '3.5vw',
                fontWeight: 300,
                lineHeight: '3.5vw',
                letterSpacing: '-0.5px',
              }}
            >
              Keep it simple, keep it secure, keep it smart.
            </Typography>
            <Typography
              sx={{
                color: '#ffffff',
                fontWeight: 500,
                lineHeight: '28px',
                letterSpacing: '0.15px',
                mt: 2,
                ml: 0.5,
              }}
            >
              GovStack Mastercard - MIFOS transactional platform
            </Typography>
          </Grid2>
        )}
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh', backgroundColor: '#f6fcf6ff', p: 1.5 }}
          size={{ xs: 12, md: 9 }}
        >
          {children}
          <Footer />
        </Grid2>
      </Grid2>
    </>
  );
};
