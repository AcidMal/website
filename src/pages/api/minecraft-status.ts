import type { APIRoute } from 'astro';
import net from 'net';

export const prerender = false

interface MinecraftServerStatus {
  online: boolean;
  players?: {
    online: number;
    max: number;
  };
  version?: string;
  lastUpdated: number;
}

const pingMinecraftServer = (host: string, port: number = 25565): Promise<MinecraftServerStatus> => {
  return new Promise((resolve) => {
    const socket = net.connect(port, host, () => {
      socket.write(Buffer.from([0xFE, 0x01]));
    });

    socket.setTimeout(5000);

    socket.on('data', (data) => {
      socket.end();
      if (data != null && data != '') {
        const serverInfo = data.toString().split('\x00\x00\x00');
        if (serverInfo.length >= 6) {
          resolve({
            online: true,
            players: {
              online: parseInt(serverInfo[4]),
              max: parseInt(serverInfo[5]),
            },
            version: serverInfo[2],
            lastUpdated: Date.now(),
          });
        } else {
          resolve({ online: true, lastUpdated: Date.now() });
        }
      } else {
        resolve({ online: false, lastUpdated: Date.now() });
      }
    });

    socket.on('timeout', () => {
      socket.end();
      resolve({ online: false, lastUpdated: Date.now() });
    });

    socket.on('error', (error) => {
      console.error(`Socket error: ${error.message}`);
      socket.end();
      resolve({ online: false, lastUpdated: Date.now() });
    });
  });
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
    console.log(`Pinging Minecraft server at ${host}`);
    const status = await pingMinecraftServer(host);
    console.log(`Minecraft server status:`, status);
    return new Response(JSON.stringify(status), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error pinging Minecraft server:', error);
    return new Response(JSON.stringify({ error: 'Failed to ping server', details: error.message, lastUpdated: Date.now() }), {
      status: 500,
      headers
    });
  }
};


