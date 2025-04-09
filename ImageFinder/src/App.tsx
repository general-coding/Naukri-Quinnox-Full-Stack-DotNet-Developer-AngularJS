import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const TOPICS = ['Travel', 'Cars', 'Wildlife', 'Technology', 'Other'];

const App = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [topic, setTopic] = useState('');
    const [customTopic, setCustomTopic] = useState('');
    const [view, setView] = useState('form'); // 'form', 'image', 'summary'
    const [imageUrl, setImageUrl] = useState('');
    const [acceptedImage, setAcceptedImage] = useState('');

    const selectedTopic = topic === 'Other' ? customTopic : topic;

    const fetchImage = async () => {
        if (!selectedTopic) return;
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=${encodeURIComponent(
                selectedTopic
            )}&client_id=LZEaaJXSPzVUNAAnble_VI9a7087nJS5j8wVNRekk6s`
        );
        const data = await response.json();
        setImageUrl(data.urls?.regular || '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchImage();
        setView('image');
    };

    const handleAccept = () => {
        setAcceptedImage(imageUrl);
        setView('summary');
    };

    const handleReject = () => {
        fetchImage();
    };

    return (
        <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f3f4f6' }}>
            {view === 'form' && (
                <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                    />
                    <input
                        type="text"
                        placeholder="Surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        required
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                    />
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                    >
                        <option value="">Select Topic</option>
                        {TOPICS.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {topic === 'Other' && (
                        <input
                            type="text"
                            placeholder="Custom Topic"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            required
                            style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
                        />
                    )}
                    <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Search</button>
                </form>
            )}

            {view === 'image' && imageUrl && (
                <div style={{ textAlign: 'center' }}>
                    <img src={imageUrl} alt={selectedTopic} style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }} />
                    <div style={{ marginTop: '1rem' }}>
                        <button onClick={handleAccept} style={{ marginRight: '1rem', padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Accept</button>
                        <button onClick={handleReject} style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem' }}>Reject</button>
                    </div>
                </div>
            )}

            {view === 'summary' && (
                <div style={{ maxWidth: '300px', padding: '1rem', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Welcome, {name} {surname}</h2>
                    <img src={acceptedImage} alt="Selected" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '1rem' }} />
                    <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>Topic: {selectedTopic}</p>
                </div>
            )}
        </div>
    );
};

export default App;