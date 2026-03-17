import { queryOptions, useQuery } from '@tanstack/react-query';

import { attachToken, threatApi } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';
import { Broadcast, Paged } from '@/types/api';

export const getBroadcasts = (
  country?: string,
  status?: string,
  userId?: string,
  active = true,
  page = 0,
  size = 10,
  sort?: string,
): Promise<Paged<Broadcast>> => {
  const params: Record<string, any> = {
    active,
    page,
    size,
  };

  if (country) {
    params.country = country;
  }

  if (status) {
    params.status = status;
  }

  if (userId) {
    params.userId = userId;
  }

  if (sort) {
    params.sort = sort;
  }

  return threatApi.get(`/api/v1/broadcasts`, {
    params,
    headers: attachToken().headers,
  });
};

export const getBroadcastsQueryOptions = ({
  country,
  status,
  userId,
  active,
  page,
  size,
  sort,
}: {
  country?: string;
  status?: string;
  userId?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}) => {
  return queryOptions({
    queryKey: ['broadcasts', { country, status, userId, active, page, size, sort }],
    queryFn: () => getBroadcasts(country, status, userId, active, page, size, sort),
  });
};

type UseBroadcastsOptions = {
  country?: string;
  status?: string;
  userId?: string;
  active?: boolean;
  page?: number;
  size?: number;
  sort?: string;
  queryConfig?: QueryConfig<typeof getBroadcastsQueryOptions>;
};

export const useBroadcasts = ({
  queryConfig,
  country,
  status,
  userId,
  active,
  page,
  size,
  sort,
}: UseBroadcastsOptions) => {
  return useQuery({
    ...getBroadcastsQueryOptions({ country, status, userId, active, page, size, sort }),
    ...queryConfig,
  });
};
