import React, { useState, useEffect } from 'react';
import ChatService from '../services/ChatService';
import ChatWindow from '../components/ChatWindow';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ChatService.getConversations().then(response => {
            setConversations(response.data.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Chargement des conversations...</p>;

    return (
        <div className="container-fluid" style={{ height: '85vh' }}>
            <div className="row h-100">
                <div className="col-4 border-end">
                    <h4 className="p-3">Conversations</h4>
                    <div className="list-group list-group-flush">
                        {conversations.map(conv => (
                            <button
                                key={conv.id}
                                className={`list-group-item list-group-item-action ${selectedConv?.id === conv.id ? 'active' : ''}`}
                                onClick={() => setSelectedConv(conv)}
                            >
                                Conversation avec <strong>{conv.with_user.name}</strong>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-8 p-0">
                    {selectedConv ? (
                        <ChatWindow conversationId={selectedConv.id} />
                    ) : (
                        <div className="d-flex h-100 justify-content-center align-items-center">
                            <p className="text-muted">Sélectionnez une conversation pour commencer à discuter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;