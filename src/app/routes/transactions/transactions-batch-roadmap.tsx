import React from 'react';

import { ContentLayout } from '@/components/layouts';
import { TransactionsBatchRoadmapView } from '@/features/transactions/components/transactions-batch-roadmap-view';

export const TransactionsBatchRoadmapViewRoute = () => {
    return (
        <ContentLayout title="Transactions">
            <TransactionsBatchRoadmapView />
        </ContentLayout>
    );
};
