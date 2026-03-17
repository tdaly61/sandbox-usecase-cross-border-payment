import { Box, Typography } from '@mui/material';

import { TransactionsInitiatedTable } from '@/features/transactions/components/transactions-initiated-table';

type TransactionsInitiatedViewParameters = {
    showCheckBox: boolean;
};

export const TransactionsInitiatedView = ({ showCheckBox }: TransactionsInitiatedViewParameters) => {
    return (
        <Box display="flex" flexDirection="column" gap={4.5}>

            <Box>
                <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
                    All Initiated Pension Payments
                </Typography>
                <TransactionsInitiatedTable />
            </Box>
        </Box>
    );
};
