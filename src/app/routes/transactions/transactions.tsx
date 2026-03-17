import React from 'react';

import { ContentLayout } from '@/components/layouts';
import { TransactionsView } from '@/features/transactions/components/transactions-view';

export const TransactionsRoute = () => {
    return (
        <ContentLayout title="Transactions">
            <TransactionsView showCheckBox={true} />
        </ContentLayout>
    );
};
