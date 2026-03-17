import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { mockAfricanBeneficiaries } from '@/mockdata/mock-african-beneficiaries';
import { Beneficiary } from '@/types/api';


export const getTransactions = async (
  country?: string,
  active?: boolean,
  rejected?: boolean,
  pending?: boolean,
  page = 1,
  size = 10,
  sort?: keyof Beneficiary,
): Promise<{ content: Beneficiary[]; totalPages: number; totalElements: number; page: number; size: number }> => {
  // Normalize
  const normalize = (b: any): Beneficiary => ({
    ...b,
    gender: b.gender as 'M' | 'F' | 'O',
    status: b.status as 'ACTIVE' | 'PENDING' | 'REJECTED',
    paymentFrequency: b.paymentFrequency as 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY',
  });

  // Which statuses to filter by?
  const statusFilters: string[] = [];
  if (active) statusFilters.push("ACTIVE");
  if (pending) statusFilters.push("PENDING");
  if (rejected) statusFilters.push("REJECTED");

  // Filter
  let filtered = mockAfricanBeneficiaries
    .map(normalize)
    .filter((b) => 
      (!country || b.nationality === country) &&
      (statusFilters.length === 0 || statusFilters.includes(b.status))
    );

  // Sort
  if (sort) {
    filtered = filtered.sort((a, b) => {
      const aVal = a[sort];
      const bVal = b[sort];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    });
  }

  // Paginate
  const start = (page - 1) * size;
  const end = start + size;
  const paged = filtered.slice(start, end);

  return {
    content: paged,
    totalPages: Math.ceil(filtered.length / size),
    totalElements: filtered.length,
    page,
    size,
  };
};


export const getTransactionsQueryOptions = ({
  country,
  active,
  rejected,
  pending,
  page,
  size,
  sort,
}: {
  country?: string;
  active?: boolean;
  rejected?: boolean;
  pending?: boolean;
  page?: number;
  size?: number;
  sort?: keyof Beneficiary;
}) => {
  return queryOptions({
    queryKey: ['transactions', { country, active, rejected, pending, page, size, sort }],
    queryFn: () => getTransactions(country, active, rejected, pending, page, size, sort),
  });
};


type UseTransactionsOptions = {
  country?: string;
  active?: boolean;
  rejected?: boolean;
  pending?: boolean;
  page?: number;
  size?: number;
  sort?: keyof Beneficiary;
  queryConfig?: QueryConfig<typeof getTransactionsQueryOptions>;
};


export const useTransactions = ({
  queryConfig,
  country,
  active,
  rejected,
  pending,
  page,
  size,
  sort,
}: UseTransactionsOptions) => {
  return useQuery({
    ...getTransactionsQueryOptions({ country, active, rejected, pending, page, size, sort }),
    ...queryConfig,
  });
};
