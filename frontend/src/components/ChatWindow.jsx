import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatService from '../services/ChatService';
import echo from '../services/echo';

const ChatWindow = ({ conversationId }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null); // Pour le scroll automatique

    // Fonction pour faire défiler vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]); // Se déclenche à chaque nouveau message

    // Effet pour charger les messages et écouter les événements
    useEffect(() => {
        if (!conversationId) return;

        // 1. Charger l'historique des messages
        ChatService.getMessages(conversationId).then(response => {
            setMessages(response.data.data);
        });

        // 2. Écouter les nouveaux messages en temps réel
        const channel = echo.private(`conversations.${conversationId}`);
        
        channel.listen('.new-message', (event) => {
            // Ajoute le nouveau message à la liste, sans recharger la page
            setMessages(prevMessages => [...prevMessages, event.message]);
        });

        // 3. Nettoyer l'écouteur en quittant le composant
        return () => {
            echo.leaveChannel(`conversations.${conversationId}`);
        };

    }, [conversationId]); // Se relance si on change de conversation

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !file) return;

        const formData = new FormData();
        formData.append('content', newMessage);
        if (file) {
            formData.append('file', file);
        }
        
        // On envoie le message. On N'ajoute PAS le message manuellement ici.
        // L'événement Echo s'en chargera, confirmant que le serveur l'a bien reçu.
        await ChatService.sendMessage(conversationId, formData);
        
        setNewMessage('');
        setFile(null);
    };
    
    return (
        <div className="d-flex flex-column h-100">
            <div className="flex-grow-1 p-3" style={{ overflowY: 'auto', maxHeight: '65vh' }}>
                {messages.map(msg => (
                    <div key={msg.id} className={`d-flex mb-2 ${msg.sender.id === user.id ? 'justify-content-end' : ''}`}>
                        <div className={`p-2 rounded ${msg.sender.id === user.id ? 'bg-primary text-white' : 'bg-light'}`} style={{ maxWidth: '70%' }}>
                            <strong>{msg.sender.id !== user.id ? msg.sender.name : 'Moi'}</strong>
                            <p className="mb-0">{msg.content}</p>
                            {msg.file_url && <a href={msg.file_url} target="_blank" rel="noopener noreferrer">Voir le fichier joint</a>}
                            <small className="d-block text-end mt-1">{new Date(msg.sent_at).toLocaleTimeString()}</small>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} /> {/* Ancre pour le scroll */}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-3 bg-light border-top">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Écrire un message..." value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                    <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} />
                    <button className="btn btn-primary" type="submit">Envoyer</button>
                </div>
            </form>
        </div>
    );
};

export default ChatWindow;