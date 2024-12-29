import React from 'react';
import useSWR from 'swr';

interface ServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  lastUpdated?: number;
}

const SERVER_HOSTNAME = 'join.acidmal.com'; // Hardcoded server hostname

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

const MinecraftServerStatus: React.FC = () => {
  const { data: status, error, mutate } = useSWR<ServerStatus>(
    `/api/minecraft-status?host=${encodeURIComponent(SERVER_HOSTNAME)}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true, // Refresh when the page gets focus
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  React.useEffect(() => {
    console.log('MinecraftServerStatus rendered', { SERVER_HOSTNAME, status, error });
  }, [status, error]);

  if (error) {
    return <div className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 p-4 rounded-lg">Error fetching server status: {error.message}</div>;
  }

  if (!status) {
    return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">Pinging Minecraft server...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">Minecraft Server Status</h2>
      <p className="mb-2">
        Server: <span className="font-semibold">{SERVER_HOSTNAME}</span>
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
      {status.lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(status.lastUpdated).toLocaleTimeString()}
        </p>
      )}
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


