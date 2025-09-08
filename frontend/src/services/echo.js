import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import apiClient from './apiClient';

// On déclare Pusher globalement pour qu'Echo puisse le trouver
window.Pusher = Pusher;

const options = {
    broadcaster: 'pusher',
    key: 'REPLACE_WITH_YOUR_REVERB_APP_KEY', // <-- Mets ta vraie clé ici
    wsHost: import.meta.env.VITE_REVERB_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME || 'http') === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],

    // --- Correction ajoutée ---
    cluster: '',

    // --- Authorizer pour les canaux privés ---
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                apiClient.post('/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                })
                .then(response => {
                    callback(false, response.data);
                })
                .catch(error => {
                    callback(true, error);
                });
            }
        };
    },
};

// On exporte une instance que nous pouvons utiliser partout
const echo = new Echo(options);

export default echo;
