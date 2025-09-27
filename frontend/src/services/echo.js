import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY;
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST;
const REVERB_PORT = parseInt(import.meta.env.VITE_REVERB_PORT);
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME;

const options = {
    broadcaster: 'reverb',
    key: REVERB_APP_KEY,
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,
    forceTLS: true,
    enabledTransports: ['ws', 'wss'],
    
    // Simplified authorizer for Railway
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                fetch(`${import.meta.env.VITE_API_URL}/broadcasting/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Auth success:', data);
                    callback(false, data);
                })
                .catch(error => {
                    console.error('Auth error:', error);
                    callback(true, error);
                });
            }
        };
    },
};

// Add connection logging
const echo = new Echo(options);

// Log connection events
echo.connector.pusher.connection.bind('state_change', (states) => {
    console.log('Pusher state changed:', states);
});

echo.connector.pusher.connection.bind('connected', () => {
    console.log('Pusher connected successfully!');
});

echo.connector.pusher.connection.bind('error', (error) => {
    console.error('Pusher connection error:', error);
});

export default echo;