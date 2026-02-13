import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';
import { uploadImage } from '../services/uploadService';

const POPULAR_ANIME = [
    'Naruto', 'One Piece', 'Attack on Titan', 'Demon Slayer',
    'Jujutsu Kaisen', 'My Hero Academia', 'Dragon Ball', 'Bleach',
    'Death Note', 'Fullmetal Alchemist', 'Chainsaw Man', 'Spy x Family',
    'One Punch Man', 'Hunter x Hunter', 'Mob Psycho 100', 'Vinland Saga'
];

export default function CreatePostPage() {
    const [caption, setCaption] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
    };

    const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

    const addCustomTag = () => {
        if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
            setSelectedTags(prev => [...prev, customTag.trim()]);
            setCustomTag('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!caption.trim()) { setError('Caption is required'); return; }
        setLoading(true);
        setError('');
        try {
            let imageUrl = '';
            if (imageFile) {
                try { const r = await uploadImage(imageFile); imageUrl = r.data.url; } catch { /* skip if no cloudinary */ }
            }
            await createPost({ caption, image: imageUrl, animeTags: selectedTags });
            navigate('/');
        } catch (err) { setError(err.response?.data?.message || 'Failed to create post'); }
        finally { setLoading(false); }
    };

    return (
        <div className="create-page">
            <div className="create-card">
                <h2>✨ New Technique</h2>
                <p className="create-subtitle">Share your power with the arena</p>
                <form onSubmit={handleSubmit}>
                    <div className="image-picker">
                        <input type="file" accept="image/*" id="imageInput" hidden onChange={handleImageChange} />
                        <label htmlFor="imageInput" className="image-picker-label">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    <span>Add Image</span>
                                </div>
                            )}
                        </label>
                    </div>
                    <div className="input-group">
                        <textarea placeholder="What's your battle cry?" value={caption} onChange={e => setCaption(e.target.value)} rows={3} maxLength={500} />
                        <span className="char-count">{caption.length}/500</span>
                    </div>
                    <div className="tag-section">
                        <h4>Anime Tags</h4>
                        <div className="tag-grid">
                            {POPULAR_ANIME.map(tag => (
                                <button type="button" key={tag} className={`tag-chip ${selectedTags.includes(tag) ? 'selected' : ''}`} onClick={() => toggleTag(tag)}>{tag}</button>
                            ))}
                        </div>
                        <div className="custom-tag">
                            <input type="text" placeholder="Custom tag..." value={customTag} onChange={e => setCustomTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())} />
                            <button type="button" onClick={addCustomTag} className="add-tag-btn">+</button>
                        </div>
                        {selectedTags.length > 0 && (
                            <div className="selected-tags">
                                {selectedTags.map((t, i) => <span key={i} className="anime-tag sel" onClick={() => toggleTag(t)}>#{t} ×</span>)}
                            </div>
                        )}
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner"></span> : '🔥 Unleash'}
                    </button>
                </form>
            </div>
        </div>
    );
}
