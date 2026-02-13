import { useState, useEffect, useCallback, useRef } from 'react';
import { getFeed } from '../services/postService';
import PostCard from '../components/PostCard';

export default function FeedPage() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    const loadPosts = useCallback(async (p) => {
        setLoading(true);
        try {
            const res = await getFeed(p);
            setPosts(prev => p === 1 ? res.data.posts : [...prev, ...res.data.posts]);
            setHasMore(p < res.data.totalPages);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { loadPosts(1); }, [loadPosts]);

    const lastRef = useCallback((node) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => { const n = prev + 1; loadPosts(n); return n; });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, loadPosts]);

    const handleDelete = (id) => setPosts(prev => prev.filter(p => p._id !== id));

    return (
        <div className="feed-page">
            <div className="feed-header">
                <h2>⚔️ Battle Feed</h2>
                <p>Latest from the arena</p>
            </div>
            <div className="feed-list">
                {posts.map((post, i) => (
                    <div key={post._id} ref={i === posts.length - 1 ? lastRef : null} className="feed-item-wrapper">
                        <PostCard post={post} onDelete={handleDelete} />
                    </div>
                ))}
                {loading && (
                    <div className="feed-loader">
                        <div className="energy-ring"></div>
                        <p>Channeling energy...</p>
                    </div>
                )}
                {!loading && posts.length === 0 && (
                    <div className="feed-empty">
                        <span className="empty-icon">🌑</span>
                        <h3>The arena is empty</h3>
                        <p>Be the first to make a move</p>
                    </div>
                )}
                {!hasMore && posts.length > 0 && (
                    <p className="feed-end">You've reached the end of the scroll 📜</p>
                )}
            </div>
        </div>
    );
}
