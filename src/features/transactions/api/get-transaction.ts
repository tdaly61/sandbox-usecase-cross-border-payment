import { queryOptions, useQuery } from '@tanstack/react-query';

import { mockAfricanBeneficiaries } from '@/mockdata/mock-african-beneficiaries';
import { QueryConfig } from '@/lib/react-query';
import { Beneficiary } from '@/types/api';

export const getTransaction = async ({ payeeIdentity }: { payeeIdentity: string }): Promise<Beneficiary> => {
  const result = mockAfricanBeneficiaries.find(b => b.payeeIdentity === payeeIdentity);

  if (!result) {
    throw new Error(`No beneficiary found with payeeIdentity: ${payeeIdentity}`);
  }

  return {
    ...result,
    gender: result.gender as 'M' | 'F' | 'O',
    status: result.status as 'ACTIVE' | 'PENDING' | 'REJECTED',
    paymentFrequency: result.paymentFrequency as 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY',
  };
};

export const getTransactionQueryOptions = (payeeIdentity: string) => {
  return queryOptions({
    queryKey: ['transactions', payeeIdentity],
    queryFn: () => getTransaction({ payeeIdentity }),
  });
};

type UseTransactionOptions = {
  payeeIdentity: string;
  queryConfig?: QueryConfig<typeof getTransactionQueryOptions>;
};

export const useTransaction = ({ payeeIdentity, queryConfig }: UseTransactionOptions) => {
  return useQuery({
    ...getTransactionQueryOptions(payeeIdentity),
    ...queryConfig,
  });
};

