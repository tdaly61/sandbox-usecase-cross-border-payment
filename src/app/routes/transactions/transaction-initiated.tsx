import { QueryClient } from '@tanstack/react-query';
import { LoaderFunctionArgs, useParams } from 'react-router-dom';

import { ContentLayout } from '@/components/layouts';
import { Spinner } from '@/components/ui/spinner/spinner';
import { getTransactionQueryOptions, useTransaction } from '@/features/transactions/api/get-transaction';
import { TransactionInitiatedView } from '@/features/transactions/components/transaction-initiated-view';

export const transactionInitiatedLoader =
    (queryClient: QueryClient) =>
        async ({ params }: LoaderFunctionArgs) => {
            const payeeIdentity = params.payeeIdentity as string;

            const transactionInitiatedQuery = getTransactionQueryOptions(payeeIdentity);

            return (
                queryClient.getQueryData(transactionInitiatedQuery.queryKey) ?? (await queryClient.fetchQuery(transactionInitiatedQuery))
            );
        };

export const TransactionInitiatedRoute = () => {
    const params = useParams();
    const payeeIdentity = params.payeeIdentity as string;
    const transactionInitiatedQuery = useTransaction({
        payeeIdentity,
    });

    if (transactionInitiatedQuery.isLoading) {
        return <Spinner />;
    }

    const transactionInitiatedData = transactionInitiatedQuery.data;

    if (!transactionInitiatedData) return null;

    return (
        <ContentLayout title={`Transaction Initiated #${transactionInitiatedData.payeeIdentity}`}>
            <TransactionInitiatedView payeeIdentity={transactionInitiatedData.payeeIdentity} />
        </ContentLayout>
    );
};
