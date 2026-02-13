import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProfile, updateProfile, deleteAccount } from '../services/userService';
import { getUserPosts } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: me, setUser, logoutUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ bio: '', favoriteAnime: '' });
    const [loading, setLoading] = useState(true);
    const isOwn = me?._id === id;

    useEffect(() => {
        setLoading(true);
        Promise.all([getProfile(id), getUserPosts(id)])
            .then(([p, po]) => {
                setProfile(p.data.user);
                setPosts(po.data.posts);
                setForm({ bio: p.data.user.bio || '', favoriteAnime: (p.data.user.favoriteAnime || []).join(', ') });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        try {
            const res = await updateProfile({ bio: form.bio, favoriteAnime: form.favoriteAnime.split(',').map(s => s.trim()).filter(Boolean) });
            setProfile(res.data.user);
            if (isOwn) setUser(res.data.user);
            setEditing(false);
        } catch (err) { console.error(err); }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('⚠️ Are you sure you want to delete your account? This will remove all your posts and comments permanently.')) return;
        if (!window.confirm('This action CANNOT be undone. Type OK to confirm.')) return;
        try {
            await deleteAccount();
            logoutUser();
            navigate('/login');
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="page-loader"><div className="energy-ring"></div></div>;
    if (!profile) return <div className="feed-empty"><h3>Warrior not found</h3></div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-banner"><div className="banner-particles"><span></span><span></span><span></span></div></div>
                <div className="profile-info">
                    <div className="profile-avatar-large">
                        {profile.avatar ? <img src={profile.avatar} alt="" /> : <span>{profile.username?.[0]?.toUpperCase()}</span>}
                    </div>
                    <h2 className="profile-name">{profile.username}</h2>
                    <p className="profile-email">{profile.email}</p>
                    {!editing ? (
                        <>
                            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                            {profile.favoriteAnime?.length > 0 && (
                                <div className="profile-anime">
                                    <h4>⭐ Favorite Anime</h4>
                                    <div className="anime-list">{profile.favoriteAnime.map((a, i) => <span key={i} className="anime-tag">{a}</span>)}</div>
                                </div>
                            )}
                            {isOwn && (
                                <div className="profile-own-actions">
                                    <button onClick={() => setEditing(true)} className="btn-secondary">Edit Profile</button>
                                    <button onClick={handleDeleteAccount} className="btn-danger">Delete Account</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="profile-edit">
                            <div className="input-group"><textarea placeholder="Your battle story..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} maxLength={200} /></div>
                            <div className="input-group"><input type="text" placeholder="Favorite anime (comma separated)" value={form.favoriteAnime} onChange={e => setForm({ ...form, favoriteAnime: e.target.value })} /></div>
                            <div className="edit-actions">
                                <button onClick={handleSave} className="btn-primary">Save</button>
                                <button onClick={() => setEditing(false)} className="btn-ghost">Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="profile-posts">
                <h3>📜 Posts ({posts.length})</h3>
                {posts.length === 0
                    ? <div className="feed-empty small"><p>No posts yet</p></div>
                    : posts.map(p => <PostCard key={p._id} post={p} onDelete={(id) => setPosts(prev => prev.filter(x => x._id !== id))} />)}
            </div>
        </div>
    );
}
