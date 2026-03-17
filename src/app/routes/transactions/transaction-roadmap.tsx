
import { ContentLayout } from '@/components/layouts';
import { TransactionRoadmap } from '@/features/transactions/components/transaction-roadmap-view';

export const TransactionRoadmapRoute = () => {
    return (
        <ContentLayout title="Transaction Roadmap">
            <TransactionRoadmap />
        </ContentLayout>
    );
};
