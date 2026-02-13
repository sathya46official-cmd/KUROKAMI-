import { useState, useEffect } from 'react';
import { getComments, addComment, deleteComment } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId, onCountChange }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getComments(postId)
            .then(res => {
                setComments(res.data.comments);
                if (onCountChange) onCountChange(res.data.comments.length);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSubmitting(true);
        try {
            const res = await addComment(postId, text);
            const updated = [res.data.comment, ...comments];
            setComments(updated);
            if (onCountChange) onCountChange(updated.length);
            setText('');
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteComment(id);
            const updated = comments.filter(c => c._id !== id);
            setComments(updated);
            if (onCountChange) onCountChange(updated.length);
        } catch (err) { console.error(err); }
    };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 60) return 'now';
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        if (s < 86400) return `${Math.floor(s / 3600)}h`;
        return `${Math.floor(s / 86400)}d`;
    };

    return (
        <div className="comment-section">
            <form onSubmit={handleSubmit} className="comment-form">
                <div className="comment-input-wrap">
                    <div className="comment-avatar-small">
                        {user?.avatar ? <img src={user.avatar} alt="" /> : <span>{user?.username?.[0]?.toUpperCase()}</span>}
                    </div>
                    <input type="text" placeholder="Drop a comment..." value={text} onChange={e => setText(e.target.value)} maxLength={300} />
                    <button type="submit" disabled={submitting || !text.trim()} className="send-btn">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                    </button>
                </div>
            </form>
            {loading ? (
                <div className="comment-loader"><div className="spinner"></div></div>
            ) : (
                <div className="comments-list">
                    {comments.map(c => (
                        <div key={c._id} className="comment-item">
                            <div className="comment-avatar-small">
                                {c.user?.avatar ? <img src={c.user.avatar} alt="" /> : <span>{c.user?.username?.[0]?.toUpperCase()}</span>}
                            </div>
                            <div className="comment-body">
                                <div className="comment-meta">
                                    <span className="comment-user">{c.user?.username}</span>
                                    <span className="comment-time">{timeAgo(c.createdAt)}</span>
                                </div>
                                <p className="comment-text">{c.text}</p>
                            </div>
                            {user?._id === c.user?._id && (
                                <button onClick={() => handleDelete(c._id)} className="comment-delete">×</button>
                            )}
                        </div>
                    ))}
                    {comments.length === 0 && <p className="no-comments">No comments yet. Be the first! 💬</p>}
                </div>
            )}
        </div>
    );
}
