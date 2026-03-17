import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Dashboard } from '@/types/api';

export const getDashboard = (country: string): Promise<Dashboard> => {
  const params: Record<string, any> = {
    country,
  };

  return threatApi.get(`/api/v1/overview`, {
    params,
    headers: attachToken().headers,
  });
};

export const getDashboardQueryOptions = ({ country }: { country: string }) => {
  return queryOptions({
    queryKey: ['dashboard', { country }],
    queryFn: () => getDashboard(country),
  });
};

type UseDashboardOptions = {
  country: string;
  queryConfig?: QueryConfig<typeof getDashboardQueryOptions>;
};

export const useDashboard = ({ queryConfig, country }: UseDashboardOptions) => {
  return useQuery({
    ...getDashboardQueryOptions({ country }),
    ...queryConfig,
  });
};
