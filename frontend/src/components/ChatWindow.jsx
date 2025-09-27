import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatService from '../services/ChatService';
import echo from '../services/echo';
import styles from '../pages/ChatPage.module.css';
import { FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

// Fonction utilitaire pour formater les dates des messages
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

    // Scroll automatique vers le bas à chaque nouveau message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    useEffect(scrollToBottom, [messages]);

    // Chargement des messages et écoute des nouveaux messages en temps réel
    useEffect(() => {
    const pollInterval = setInterval(() => {
        if (conversation) {
            ChatService.getMessages(conversation.id).then(response => {
                setMessages(response.data.data);
            });
        }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
}, [conversation]);

    // Envoi de message texte ou fichier
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() && !file) return;

        const formData = new FormData();
        formData.append('content', newMessage);
        if (file) formData.append('file', file);

        await ChatService.sendMessage(conversation.id, formData);

        setNewMessage('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <>
            {/* Entête de la fenêtre de chat */}
            <div className={styles.chatHeader}>
                <div className={styles.avatar}>{conversation.with_user.name.substring(0, 2).toUpperCase()}</div>
                <h5>{conversation.with_user.name}</h5>
            </div>

            {/* Zone de messages */}
            <div className={styles.chatMessagesArea}>
                {messages.map((msg) => {
                    const isSentByMe = msg.sender.id === user.id; // true si message envoyé par moi
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
                                    style={{ textAlign: isSentByMe ? 'right' : 'left', color: isSentByMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }}
                                >
                                    {formatMessageDate(msg.sent_at)}
                                </small>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Formulaire d'envoi */}
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