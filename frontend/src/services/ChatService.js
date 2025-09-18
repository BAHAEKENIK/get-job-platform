import apiClient from './apiClient';

const ChatService = {
    getConversations: () => {
        return apiClient.get('/chat/conversations');
    },
    getMessages: (conversationId) => {
        return apiClient.get(`/chat/conversations/${conversationId}/messages`);
    },
    sendMessage: (conversationId, formData) => {
        return apiClient.post(`/chat/conversations/${conversationId}/messages`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    startConversation: (userId) => {
        return apiClient.post('/chat/conversations/start', { user_id: userId });
    }
};

export default ChatService;