import { Box, Divider, Grid2 as Grid, Typography } from '@mui/material';

import Container from '@/components/ui/container/container';
import { TransactionsTable } from '@/features/transactions/components/transactions-table';
import { useTransactions } from '@/features/transactions/api/get-transactions';
import { LatestTransactionsList } from '@/features/transactions/components/latest-transactions-list';
import { useNavigate } from 'react-router-dom';
// Import CountryFlag from 'react-country-flag' or your actual flag component
import CountryFlag from 'react-country-flag';
import { useInitiatedTransactions } from '@/hooks/initiated-transactions';
import { useEffect, useState } from 'react';


export const DashboardView = () => {
    const navigate = useNavigate();
    const { data } = useTransactions({
        // No filters: get all transactions (or page:1, size:9999 if you want all)
        page: 1,
        size: 9999, // Large enough to get all
    });
    const [readyForPayment, setReadyForPayment] = useState(0);
    const { transactionsInitiated } = useInitiatedTransactions();
    const activeCount = data?.content.filter((c) => c.status === "ACTIVE").length ?? 0;
    const pendingCount = data?.content.filter((c) => c.status === "PENDING").length ?? 0;
    const rejectedCount = data?.content.filter((c) => c.status === "REJECTED").length ?? 0;
    // Dummy implementation for countryFlag, replace with your actual implementation or import
    const countryFlag = (code: string, style = {}) => (
        <CountryFlag
            countryCode={code}
            svg
            style={{
                width: '1.6em',
                height: '1.6em',
                borderRadius: '3px',
                boxShadow: '0 0 1px #aaa',
                ...style,
            }}
            title={code}
        />
    );

    // Map currency codes to country codes for flag display
    const isoMap: Record<string, string> = {
        ZWL: 'ZW', // Zimbabwe Dollar -> Zimbabwe
        USD: 'US', // US Dollar -> United States
        ZAR: 'ZA', // South African Rand -> South Africa
    };
    const numberOfTransactions = data?.content.filter((tx) => tx.status === "ACTIVE").length || 0;

    useEffect(() => {
        if (data?.content) {
            const numberOfActive = data.content.filter(tx => tx.status === "ACTIVE").length;
            setReadyForPayment(Math.max(0, numberOfActive - transactionsInitiated.length));
        }
    }, [data, transactionsInitiated]);

    return (
        <>      <Grid container spacing={3}>
            <Grid size={{ xs: 12, lg: 8 }} sx={{ maxWidth: 1200 }}>
                <Grid container rowSpacing={2} columnSpacing={3}>
                    <Grid size={12} display="flex" gap={1.5} alignItems="flex-end">
                        <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
                            Overview
                        </Typography>
                        <Typography fontSize={12} letterSpacing={1} textTransform="uppercase">
                            Last 7 days
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Container
                            title="Status Overview"
                            tooltip="Status Overview is information about payments statuses."
                        >
                            <Box display="flex" justifyContent="space-between" textAlign="center">
                                <Box flex={1} pr={1.5}>
                                    <Typography variant="h3" color="#426834">{transactionsInitiated.length}</Typography>
                                    <Typography fontSize={14} color="#43483F" whiteSpace="nowrap">
                                        Paid
                                    </Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box flex={1} pl={1.5} pr={1.5}>
                                    <Typography variant="h3" color="#fbc02d">
                                        {readyForPayment}
                                    </Typography>
                                    <Typography fontSize={14} color="#43483F" whiteSpace="nowrap">
                                        Ready for Payment
                                    </Typography>
                                </Box>
                            </Box>
                        </Container>
                    </Grid>
                    <Grid size={12} sx={{ mt: '20px' }}>
                        <Typography variant="h5" sx={{ lineHeight: 'normal' }}>
                            Quick Actions
                        </Typography>
                    </Grid>

                    <Grid size={6}>
                        <Container
                            title="Initiate Outstanding Pension Payments"
                            sx={{ height: '100%' }}
                            button={{
                                text: 'Initiate',
                                action: () => navigate('/transactions-batch-roadmap'),   // ✅ go to new page
                                variant: 'contained',
                                sx: {
                                    backgroundColor: '#426834',
                                    color: '#FFF',
                                    '&:hover': { backgroundColor: '#55c9f7ff' },
                                },
                            }}
                        >
                            <Typography color="#43483F" fontSize={14} sx={{ minHeight: 42 }}>
                                There are {activeCount} new outstanding pension payments for today.
                            </Typography>
                        </Container>
                    </Grid>
                </Grid>
            </Grid>
            <Grid size={{ xs: 12, lg: 'grow' }}>
                <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 2 }}>
                    Recent Payments
                </Typography>
                <Container sx={{ p: 0, height: 'calc(100% - 44px)' }}>

                    <Box
                        key={2}
                        sx={{
                            '&:not(:last-child)': {
                                borderBottom: '1px solid #d4f5f6ff',
                            },
                        }}
                    >
                        <Box>
                            <LatestTransactionsList />
                        </Box>
                    </Box>
                </Container>
            </Grid>
        </Grid >
            <Box sx={{ mt: 4.5 }}>
                <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
                    Outstanding Pension Payments
                </Typography>
                <TransactionsTable initialRowsPerPage={5} sort="periodStart,desc" />
            </Box>
        </>
    );
};
