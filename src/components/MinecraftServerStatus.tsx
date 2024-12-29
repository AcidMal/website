import React from 'react';
import useSWR from 'swr';

interface MinecraftServerStatusProps {
  host?: string;
}

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  lastUpdated: number;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const MinecraftServerStatus: React.FC<MinecraftServerStatusProps> = ({ host }) => {
  const { data: status, error, mutate } = useSWR<ServerStatus>(
    `/api/minecraft-status${host ? `?host=${encodeURIComponent(host)}` : ''}`,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      dedupingInterval: 5000,
    }
  );

  React.useEffect(() => {
    console.log('MinecraftServerStatus rendered', { host, status, error });
  }, [host, status, error]);

  if (error) {
    return <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">Error fetching server status: {error.message}</div>;
  }

  if (!status) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">Fetching Minecraft server status...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Minecraft Server Status</h2>
      <p className="mb-2">
        Server: <span className="font-semibold">{host || 'Default Server'}</span>
      </p>
      <p className="mb-2">
        Status:{' '}
        <span className={`font-semibold ${status.online ? 'text-green-500' : 'text-red-500'}`}>
          {status.online ? 'Online' : 'Offline'}
        </span>
      </p>
      {status.online && status.players && (
        <p className="mb-2">
          Players: {status.players.online} / {status.players.max}
        </p>
      )}
      {status.online && status.version && (
        <p className="mb-2">Version: {status.version}</p>
      )}
      <p className="text-sm text-gray-500">
        Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
      </p>
      <button
        onClick={() => mutate()}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Now
      </button>
    </div>
  );
};

export default MinecraftServerStatus;


