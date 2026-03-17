import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner/spinner';
import { getTransactionQueryOptions, useTransaction } from '@/features/transactions/api/get-transaction';
import { TransactionView } from '@/features/transactions/components/transaction-view';

export const transactionLoader =
    (queryClient: QueryClient) =>
        async ({ params }: LoaderFunctionArgs) => {
            const payeeIdentity = params.payeeIdentity as string;

            const transactionQuery = getTransactionQueryOptions(payeeIdentity);

            return (
                queryClient.getQueryData(transactionQuery.queryKey) ?? (await queryClient.fetchQuery(transactionQuery))
            );
        };

export const TransactionRoute = () => {
    const params = useParams();
    const payeeIdentity = params.payeeIdentity as string;
    const transactionQuery = useTransaction({
        payeeIdentity,
    });

    if (transactionQuery.isLoading) {
        return <Spinner />;
    }

    const transactionData = transactionQuery.data;

    if (!transactionData) return null;

    return (
        <ContentLayout title={`Transaction #${transactionData.payeeIdentity}`}>
            <TransactionView payeeIdentity={transactionData.payeeIdentity} />
        </ContentLayout>
    );
};
