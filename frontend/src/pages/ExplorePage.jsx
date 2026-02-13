import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchUsers, getAllUsers, getTrendingPosts } from '../services/exploreService';
import { useAuth } from '../context/AuthContext';

export default function ExplorePage() {
    const { user: me } = useAuth();
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users');

    useEffect(() => {
        Promise.all([getAllUsers(), getTrendingPosts()])
            .then(([u, t]) => { setUsers(u.data.users); setTrending(t.data.posts); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSearch = async (e) => {
        const q = e.target.value;
        setQuery(q);
        if (q.trim()) {
            const res = await searchUsers(q);
            setUsers(res.data.users);
        } else {
            const res = await getAllUsers();
            setUsers(res.data.users);
        }
    };

    if (loading) return <div className="page-loader"><div className="energy-ring"></div></div>;

    return (
        <div className="explore-page">
            <div className="explore-header">
                <h2>🔍 Explore</h2>
                <p>Discover warriors & trending battles</p>
            </div>

            <div className="search-bar">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <input type="text" placeholder="Search warriors, anime, tags..." value={query} onChange={handleSearch} />
                {query && <button className="search-clear" onClick={() => { setQuery(''); handleSearch({ target: { value: '' } }); }}>×</button>}
            </div>

            <div className="explore-tabs">
                <button className={`explore-tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                    Warriors
                </button>
                <button className={`explore-tab ${tab === 'trending' ? 'active' : ''}`} onClick={() => setTab('trending')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    Trending
                </button>
            </div>

            {tab === 'users' && (
                <div className="user-grid">
                    {users.filter(u => u._id !== me?._id).map((u) => (
                        <Link to={`/profile/${u._id}`} key={u._id} className="user-card">
                            <div className="user-card-avatar">
                                {u.avatar ? <img src={u.avatar} alt="" /> : <span>{u.username[0].toUpperCase()}</span>}
                            </div>
                            <div className="user-card-info">
                                <h3>{u.username}</h3>
                                {u.bio && <p className="user-card-bio">{u.bio}</p>}
                                {u.favoriteAnime?.length > 0 && (
                                    <div className="user-card-tags">
                                        {u.favoriteAnime.slice(0, 3).map((a, i) => <span key={i} className="anime-tag small">{a}</span>)}
                                        {u.favoriteAnime.length > 3 && <span className="anime-tag small">+{u.favoriteAnime.length - 3}</span>}
                                    </div>
                                )}
                            </div>
                            <svg className="user-card-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                        </Link>
                    ))}
                    {users.filter(u => u._id !== me?._id).length === 0 && (
                        <div className="feed-empty small"><span className="empty-icon">👥</span><h3>No warriors found</h3><p>Try a different search</p></div>
                    )}
                </div>
            )}

            {tab === 'trending' && (
                <div className="trending-grid">
                    {trending.map(p => (
                        <div key={p._id} className="trending-card">
                            {p.image && <img src={p.image} alt="" className="trending-img" />}
                            <div className="trending-body">
                                <p className="trending-caption">{p.caption?.slice(0, 80)}{p.caption?.length > 80 ? '...' : ''}</p>
                                <div className="trending-meta">
                                    <span>❤️ {p.likes?.length || 0}</span>
                                    <span>@{p.user?.username}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {trending.length === 0 && (
                        <div className="feed-empty small"><span className="empty-icon">🔥</span><h3>No trending posts yet</h3><p>Be the first to make waves</p></div>
                    )}
                </div>
            )}
        </div>
    );
}
