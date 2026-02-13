import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await login(form);
            loginUser(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                    <p className="tagline">Evolve or Fade</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                        <span className="input-glow"></span>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                        <span className="input-glow"></span>
                    </div>
                    {error && <p className="auth-error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Enter the Arena'}
                    </button>
                </form>
                <p className="auth-switch">New warrior? <Link to="/register">Join the Battle</Link></p>
            </div>
        </div>
    );
}
