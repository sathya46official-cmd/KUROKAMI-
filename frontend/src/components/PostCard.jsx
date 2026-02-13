import { useState } from 'react';
import { Link } from 'react-router-dom';
import { likePost, deletePost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

export default function PostCard({ post, onDelete, onLike }) {
    const { user } = useAuth();
    const [liked, setLiked] = useState(post.likes?.includes(user?._id));
    const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
    const [animateLike, setAnimateLike] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [shared, setShared] = useState(false);

    const handleShare = async () => {
        const url = `${window.location.origin}/post/${post._id}`;
        const text = `${post.user?.username}: ${post.caption?.slice(0, 80) || 'Check out this post on KUROKAMI'}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'KUROKAMI', text, url });
            } else {
                await navigator.clipboard.writeText(url);
                setShared(true);
                setTimeout(() => setShared(false), 2000);
            }
        } catch (err) {
            if (err.name !== 'AbortError') console.error(err);
        }
    };

    const handleLike = async () => {
        try {
            setAnimateLike(true);
            const res = await likePost(post._id);
            const up = res.data.post;
            setLiked(up.likes.includes(user?._id));
            setLikeCount(up.likes.length);
            if (onLike) onLike(up);
            setTimeout(() => setAnimateLike(false), 600);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await deletePost(post._id);
            if (onDelete) onDelete(post._id);
        } catch (err) { console.error(err); }
    };

    const timeAgo = (d) => {
        const s = Math.floor((Date.now() - new Date(d)) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m ago`;
        if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
        return `${Math.floor(s / 86400)}d ago`;
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <Link to={`/profile/${post.user?._id}`} className="post-user">
                    <div className="post-avatar">
                        {post.user?.avatar
                            ? <img src={post.user.avatar} alt="" />
                            : <span>{post.user?.username?.[0]?.toUpperCase() || '?'}</span>}
                    </div>
                    <div>
                        <span className="post-username">{post.user?.username}</span>
                        <span className="post-time">{timeAgo(post.createdAt)}</span>
                    </div>
                </Link>
                {user?._id === post.user?._id && (
                    <button onClick={handleDelete} className="post-delete" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                    </button>
                )}
            </div>

            {post.image && (
                <div className="post-image">
                    <img src={post.image} alt="" loading="lazy" />
                </div>
            )}

            <div className="post-body">
                <p className="post-caption">{post.caption}</p>
                {post.animeTags?.length > 0 && (
                    <div className="post-tags">
                        {post.animeTags.map((tag, i) => (
                            <span key={i} className="anime-tag">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="post-actions">
                    <button className={`like-btn ${liked ? 'liked' : ''} ${animateLike ? 'animate' : ''}`} onClick={handleLike}>
                        <svg viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        <span>{likeCount}</span>
                    </button>
                    <button className={`comment-btn ${showComments ? 'active' : ''}`} onClick={() => setShowComments(!showComments)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        <span>{showComments ? 'Hide' : 'Comments'}{commentCount > 0 ? ` (${commentCount})` : ''}</span>
                    </button>
                    <button className={`share-btn ${shared ? 'shared' : ''}`} onClick={handleShare}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                        <span>{shared ? 'Copied!' : 'Share'}</span>
                    </button>
                </div>
            </div>

            {/* Instagram-style inline comments */}
            <div className={`inline-comments ${showComments ? 'open' : ''}`}>
                {showComments && <CommentSection postId={post._id} onCountChange={setCommentCount} />}
            </div>
        </div>
    );
}
