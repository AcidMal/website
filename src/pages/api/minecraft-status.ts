import type { APIRoute } from 'astro';

interface MinecraftServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  lastUpdated: number;
}

const getMinecraftServerStatus = async (host: string): Promise<MinecraftServerStatus> => {
  const response = await fetch(`https://api.mcsrvstat.us/2/${host}`);
  const data = await response.json();

  return {
    online: data.online,
    players: data.players ? {
      online: data.players.online,
      max: data.players.max
    } : undefined,
    version: data.version,
    lastUpdated: Date.now()
  };
};

export const GET: APIRoute = async ({ request }) => {
  console.log('API route called', new Date().toISOString());

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  const url = new URL(request.url);
  let host = url.searchParams.get('host') || import.meta.env.PUBLIC_MINECRAFT_SERVER_HOST;

  console.log('Requested host:', host);

  if (!host) {
    console.error('Host parameter is missing and not set in environment variables');
    return new Response(JSON.stringify({ error: 'Minecraft server host is not configured', lastUpdated: Date.now() }), {
      status: 400,
      headers
    });
  }

  // Remove the protocol if it's included in the host
  host = host.replace(/^https?:\/\//, '');

  try {
    console.log(`Fetching Minecraft server status for ${host}`);
    const status = await getMinecraftServerStatus(host);
    console.log(`Minecraft server status:`, status);
    return new Response(JSON.stringify(status), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching Minecraft server status:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch server status', details: error.message, lastUpdated: Date.now() }), {
      status: 500,
      headers
    });
  }
};


