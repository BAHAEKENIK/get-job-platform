import apiClient from './apiClient';

const ChatService = {
    // Récupère toutes les conversations de l'utilisateur
    getConversations: () => {
        return apiClient.get('/chat/conversations');
    },

    // Récupère l'historique des messages pour une conversation
    getMessages: (conversationId) => {
        return apiClient.get(`/chat/conversations/${conversationId}/messages`);
    },

    // Envoie un nouveau message (texte ou fichier)
    sendMessage: (conversationId, formData) => {
        return apiClient.post(`/chat/conversations/${conversationId}/messages`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

export default ChatService;