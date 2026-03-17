import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getBroadcastsQueryOptions } from '@/features/broadcast/api/get-broadcasts';
import { attachToken, threatApi } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Broadcast } from '@/types/api';

export const createBroadcast = ({ threatId }: { threatId: string }): Promise<Broadcast> => {
  return threatApi.post(`/api/v1/broadcasts`, { threatId }, { headers: attachToken().headers });
};

type UseCreateBroadcastOptions = {
  mutationConfig?: MutationConfig<typeof createBroadcast>;
};

export const useCreateBroadcast = ({ mutationConfig }: UseCreateBroadcastOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getBroadcastsQueryOptions({}).queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: ({ threatId }: { threatId: string }) => createBroadcast({ threatId }),
  });
};
