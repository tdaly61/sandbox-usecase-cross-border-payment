import React from 'react';

import { ContentLayout } from '@/components/layouts';
import { TransactionsInitiatedView } from '@/features/transactions/components/transactions-initiated-view';

export const TransactionsInitiatedRoute = () => {
    return (
        <ContentLayout title="Transactions Initiated">
            <TransactionsInitiatedView showCheckBox={true} />
        </ContentLayout>
    );
};
