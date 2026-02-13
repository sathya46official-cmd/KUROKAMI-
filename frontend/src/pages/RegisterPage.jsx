import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        setLoading(true);
        try {
            const res = await register(form);
            loginUser(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="auth-page">
            <div className="auth-bg">
                <div className="floating-particle p1"></div>
                <div className="floating-particle p2"></div>
                <div className="floating-particle p3"></div>
                <div className="floating-particle p4"></div>
                <div className="floating-particle p5"></div>
                <div className="floating-particle p6"></div>
            </div>
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">⚔️</span>
                    <h1>KUROKAMI</h1>
                    <p className="tagline">Choose Your Path</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="text" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required minLength={3} />
                        <span className="input-glow"></span>
                    </div>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        <span className="input-glow"></span>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        <span className="input-glow"></span>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Re-enter Password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                        <span className="input-glow"></span>
                        {form.confirmPassword && form.password !== form.confirmPassword && (
                            <span className="input-mismatch">Passwords don't match</span>
                        )}
                        {form.confirmPassword && form.password === form.confirmPassword && form.confirmPassword.length >= 6 && (
                            <span className="input-match">✓ Passwords match</span>
                        )}
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading || (form.confirmPassword && form.password !== form.confirmPassword)}>
                        {loading ? <span className="spinner"></span> : 'Awaken Your Power'}
                    </button>
                </form>
                <p className="auth-switch">Already a warrior? <Link to="/login">Return to Battle</Link></p>
            </div>
        </div>
    );
}
