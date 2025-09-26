import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

// On utilise les variables d'environnement exposées par Vite
const REVERB_APP_KEY = import.meta.env.VITE_REVERB_APP_KEY;
const REVERB_HOST = import.meta.env.VITE_REVERB_HOST;
const REVERB_PORT = parseInt(import.meta.env.VITE_REVERB_PORT);
const REVERB_SCHEME = import.meta.env.VITE_REVERB_SCHEME;

const options = {
    broadcaster: 'reverb', // Changed from 'pusher' to 'reverb'
    key: REVERB_APP_KEY,
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,
    forceTLS: true, // Simplified - always use TLS in production
    enabledTransports: ['ws', 'wss'],
    
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                fetch(`${import.meta.env.VITE_API_URL}/broadcasting/auth`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    credentials: 'include', // Important for cookies
                    body: JSON.stringify({
                        socket_id: socketId,
                        channel_name: channel.name
                    })
                })
                .then(response => response.json())
                .then(data => callback(false, data))
                .catch(error => callback(true, error));
            }
        };
    },
};

const echo = new Echo(options);

export default echo;