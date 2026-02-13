import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { likePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import API from '../services/api';

export default function PostDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        API.get('/posts/feed?limit=100')
            .then(res => {
                const found = res.data.posts.find(p => p._id === id);
                if (found) { setPost(found); setLiked(found.likes?.includes(user?._id)); setLikeCount(found.likes?.length || 0); }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id, user]);

    const handleLike = async () => {
        try {
            const res = await likePost(id);
            setLiked(res.data.post.likes.includes(user?._id));
            setLikeCount(res.data.post.likes.length);
        } catch (err) { console.error(err); }
    };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    if (loading) return <div className="page-loader"><div className="energy-ring"></div></div>;
    if (!post) return <div className="feed-empty"><h3>Post not found</h3><Link to="/" className="btn-secondary">Back to Feed</Link></div>;

    return (
        <div className="post-detail-page">
            <Link to="/" className="back-link">← Back to Feed</Link>
            <div className="post-detail-card">
                <div className="post-header">
                    <Link to={`/profile/${post.user?._id}`} className="post-user">
                        <div className="post-avatar">
                            {post.user?.avatar ? <img src={post.user.avatar} alt="" /> : <span>{post.user?.username?.[0]?.toUpperCase()}</span>}
                        </div>
                        <div>
                            <span className="post-username">{post.user?.username}</span>
                            <span className="post-time">{timeAgo(post.createdAt)}</span>
                        </div>
                    </Link>
                </div>
                {post.image && <div className="post-image large"><img src={post.image} alt="" /></div>}
                <div className="post-body">
                    <p className="post-caption">{post.caption}</p>
                    {post.animeTags?.length > 0 && <div className="post-tags">{post.animeTags.map((t, i) => <span key={i} className="anime-tag">#{t}</span>)}</div>}
                    <div className="post-actions">
                        <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
                            <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
                            <span>{likeCount}</span>
                        </button>
                    </div>
                </div>
                <CommentSection postId={id} />
            </div>
        </div>
    );
}
