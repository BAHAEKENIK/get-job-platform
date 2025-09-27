import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatService from '../services/ChatService';
import echo from '../services/echo';
import styles from '../pages/ChatPage.module.css';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatMessageDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return format(date, 'HH:mm');
    if (isYesterday(date)) return `Hier ${format(date, 'HH:mm')}`;
    return format(date, 'd MMM, HH:mm', { locale: fr });
};

const ChatWindow = ({ conversation }) => {
    const { user } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // Scroll automatique vers le bas
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Chargement des messages avec polling
    useEffect(() => {
        if (!conversation) return;

        // Fonction pour charger les messages
        const loadMessages = () => {
            ChatService.getMessages(conversation.id)
                .then(response => {
                    setMessages(response.data.data || []);
                })
                .catch(error => {
                    console.error("Erreur de chargement des messages:", error);
                });
        };

        // Charger immédiatement
        loadMessages();

        // Polling toutes les 3 secondes
        const pollInterval = setInterval(loadMessages, 3000);

        return () => clearInterval(pollInterval);
    }, [conversation]);

    // Envoi de message avec mise à jour optimiste
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !file) return;

        const formData = new FormData();
        formData.append('content', newMessage);
        if (file) formData.append('file', file);

        // Message optimiste (affiché immédiatement)
        const optimisticMessage = {
            id: Date.now(), // ID temporaire
            content: newMessage,
            file_url: file ? URL.createObjectURL(file) : null,
            sent_at: new Date().toISOString(),
            sender: { id: user.id, name: user.name },
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMessage]);
        setNewMessage('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";

        try {
            await ChatService.sendMessage(conversation.id, formData);
            // Le polling va actualiser avec le vrai message
        } catch (error) {
            console.error("Erreur d'envoi:", error);
            // Retirer le message optimiste en cas d'erreur
            setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
            alert("Erreur lors de l'envoi du message.");
        }
    };

    return (
        <>
            <div className={styles.chatHeader}>
                <div className={styles.avatar}>{conversation.with_user.name.substring(0, 2).toUpperCase()}</div>
                <h5>{conversation.with_user.name}</h5>
            </div>

            <div className={styles.chatMessagesArea}>
                {messages.map((msg) => {
                    const isSentByMe = msg.sender.id === user.id;
                    return (
                        <div
                            key={msg.id}
                            className={`${styles.messageContainer} ${isSentByMe ? styles.messageSent : styles.messageReceived}`}
                        >
                            <div className={`${styles.message} ${isSentByMe ? styles.sent : styles.received}`}>
                                {!isSentByMe && (
                                    <small className="d-block fw-bold text-primary">{msg.sender.name}</small>
                                )}
                                {msg.content && <p className="mb-1">{msg.content}</p>}
                                {msg.file_url && (
                                    <a
                                        href={msg.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-decoration-underline"
                                        style={{ color: 'inherit' }}
                                    >
                                        Fichier: {msg.file_url.split('/').pop()}
                                    </a>
                                )}
                                <small
                                    className="d-block"
                                    style={{ 
                                        textAlign: isSentByMe ? 'right' : 'left', 
                                        color: isSentByMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)',
                                        fontStyle: msg.isOptimistic ? 'italic' : 'normal'
                                    }}
                                >
                                    {formatMessageDate(msg.sent_at)}
                                    {msg.isOptimistic && ' (Envoi...)'}
                                </small>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                <div className="input-group">
                    <input
                        type="text"
                        className={`form-control ${styles.textInput}`}
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                    />
                    <label htmlFor="file-input" className="btn btn-light border">
                        <FaPaperclip />
                    </label>
                    <input
                        id="file-input"
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={e => setFile(e.target.files[0])}
                    />
                    <button
                        className="btn btn-primary"
                        type="submit"
                        style={{ borderRadius: '0 20px 20px 0' }}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                {file && <small className="d-block mt-1 text-muted">Sélectionné : {file.name}</small>}
            </form>
        </>
    );
};

export default ChatWindow;