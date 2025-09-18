import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ChatService from '../services/ChatService';
import ChatWindow from '../components/ChatWindow';
import styles from './ChatPage.module.css';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const canvasRef = useRef(null);

    // 🎨 Logique d'animation des particules (style Login/ForgotPassword)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles = [];
        const colors = ['#ff6b6b', '#feca57', '#48dbfb', '#1dd1a1', '#5f27cd'];

        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                dx: (Math.random() - 0.5) * 0.5, // Ralentir la vitesse
                dy: (Math.random() - 0.5) * 0.5,
            });
        }

        let mouse = { x: null, y: null };
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

                if (mouse.x && mouse.y) {
                    const distX = mouse.x - p.x; const distY = mouse.y - p.y;
                    const dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 150) { // Zone de répulsion
                        p.x -= distX / 15; p.y -= distY / 15;
                    }
                }
                
                if (Math.random() < 0.005) p.color = colors[Math.floor(Math.random() * colors.length)];
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    // Chargement des conversations (inchangé)
    useEffect(() => {
        setLoading(true);
        ChatService.getConversations()
            .then(response => {
                const allConvs = response.data.data;
                setConversations(allConvs);
                const newConvId = location.state?.newConversationId;
                if (newConvId) {
                    const convToSelect = allConvs.find(c => c.id === newConvId);
                    if (convToSelect) setSelectedConv(convToSelect);
                }
            })
            .finally(() => setLoading(false));
    }, [location.state]);

    return (
        <div className={styles.chatPageContainer}>
            <canvas ref={canvasRef} className={styles.backgroundCanvas} />
            
            {loading ? (
                <div className="d-flex w-100 justify-content-center align-items-center text-center">
                    <div style={{ zIndex: 1, color: '#333' }}>
                        <div className="spinner-border text-primary mb-3" role="status"></div>
                        <h5>Chargement de la messagerie...</h5>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles.sidebar}>
                        <div className={styles.conversationListHeader}>Messagerie</div>
                        <div className={styles.conversationList}>
                            {conversations.map(conv => (
                                <button
                                    key={conv.id}
                                    className={`${styles.conversationButton} ${selectedConv?.id === conv.id ? styles.active : ''}`}
                                    onClick={() => setSelectedConv(conv)}
                                >
                                    <div className={styles.avatar}>{conv.with_user.name.substring(0,2).toUpperCase()}</div>
                                    <div>
                                        <strong>{conv.with_user.name}</strong>
                                        {conv.last_message?.content && (
                                            <p className="mb-0 text-muted text-truncate" style={{ maxWidth: '180px' }}>
                                                {conv.last_message.content}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.chatWindow}>
                        {selectedConv ? (
                            <ChatWindow conversation={selectedConv} />
                        ) : (
                            <div className="d-flex h-100 justify-content-center align-items-center text-center">
                                <div style={{ color: '#555', zIndex: 1 }}>
                                    <h4>Bienvenue dans votre messagerie</h4>
                                    <p className="text-muted">Sélectionnez une conversation pour discuter.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatPage;