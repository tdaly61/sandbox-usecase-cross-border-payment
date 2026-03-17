import { Box, Typography } from '@mui/material';

import { TransactionsTable } from '@/features/transactions/components/transactions-table';

type TransactionsViewParameters = {
  showCheckBox: boolean;
};

export const TransactionsView = ({ showCheckBox }: TransactionsViewParameters) => {
  return (
    <Box display="flex" flexDirection="column" gap={4.5}>
      <Typography variant="h5" sx={{ lineHeight: 'normal', mb: 0.5 }}>
        All Outstanding Pension Payments
      </Typography>
      <Box>
        <TransactionsTable initialRowsPerPage={10} sort="periodStart,desc" showFilters={false} showCheckBox={showCheckBox} />
      </Box>
    </Box>
  );
};
