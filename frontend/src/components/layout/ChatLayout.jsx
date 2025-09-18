import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ChatLayout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <Navbar />
            <main style={{ flexGrow: 1, overflow: 'hidden' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default ChatLayout;
