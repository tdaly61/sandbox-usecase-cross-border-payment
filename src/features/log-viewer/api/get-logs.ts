import { useQueryClient } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { logApi } from '@/lib/api-client';
import { Log } from '@/types/api';

export const getLog = (broadcastId: string, onMessage: (log: Log) => void): EventSource | null => {
  if (!broadcastId) {
    return null;
  }

  const url = `${logApi.defaults.baseURL}/api/v1/log/${broadcastId}`;
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const log: Log = JSON.parse(event.data);
    onMessage(log);
  };

  return eventSource;
};

type UseLogOptions = {
  broadcastId: string;
  setFinalLog: Dispatch<SetStateAction<Log | undefined>>;
};

export const useLog = ({ broadcastId, setFinalLog }: UseLogOptions) => {
  const queryClient = useQueryClient();
  const initialLog: Log = {
    id: -1,
    content: 'Broadcast Initiated',
    timestamp: new Date().toISOString().slice(0, 23),
    broadcast: broadcastId,
    processed: true,
    receiver: 'Initial',
    sender: 'Initial',
  };
  const [logs, setLogs] = useState<Log[]>([initialLog]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    eventSource = getLog(broadcastId, (log) => {
      if (log.content === 'Broadcast sent') {
        log.receiver = 'Final';
        log.sender = 'Final';
      }
      if (log.receiver === 'mobile') {
        setFinalLog(log);
        //Close and invalidate once the last message is processed
        eventSource?.close();
        eventSource = null;
      } else {
        setLogs((prevLogs) => [...prevLogs, log]);
      }
      queryClient.setQueryData(['log', { broadcastId }], (oldData: Log[] = []) => [
        ...oldData,
        log,
      ]);
    });

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [broadcastId, queryClient, setFinalLog]);

  return { logs };
};
