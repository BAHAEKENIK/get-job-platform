import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from './apiClient';

window.Pusher = Pusher;

// On utilise les variables d'environnement exposées par Vite
const REVERB_APP_KEY = process.env.VITE_REVERB_APP_KEY;
const REVERB_HOST = process.env.VITE_REVERB_HOST;
const REVERB_PORT = process.env.VITE_REVERB_PORT;
const REVERB_SCHEME = process.env.VITE_REVERB_SCHEME;

const options = {
    broadcaster: 'pusher',
    key: REVERB_APP_KEY,
    wsHost: REVERB_HOST,
    wsPort: REVERB_PORT,
    wssPort: REVERB_PORT,
    forceTLS: REVERB_SCHEME === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    cluster: '', // Essentiel pour Reverb
    
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                apiClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => { callback(false, response.data); })
                .catch(error => { callback(true, error); });
            }
        };
    },
};

const echo = new Echo(options);

export default echo;