import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind } from 'lucide-react';
import api from '../services/api';

export default function Login({ setAuth }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            setAuth(true);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Incorrect email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', backgroundColor: 'var(--canvas)' }}>

            {/* Logo + Title — floating above card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{
                    width: '60px', height: '60px',
                    backgroundColor: 'var(--blue)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 28px rgba(37,99,235,0.35)',
                    marginBottom: '1.25rem'
                }}>
                    <Wind size={28} color="#ffffff" strokeWidth={2} />
                </div>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--text)', margin: 0, letterSpacing: '-0.02em' }}>
                    Welcome back
                </h1>
                <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.925rem', fontWeight: 500 }}>
                    Sign in to AtmoSense
                </p>
            </div>

            {/* Card */}
            <div className="atmo-card" style={{ width: '100%', maxWidth: '420px', padding: '2rem' }}>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#f87171',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.625rem',
                        fontSize: '0.875rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        fontWeight: 500
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                            EMAIL ADDRESS
                        </label>
                        <input
                            type="email"
                            className="atmo-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.825rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.02em' }}>
                            PASSWORD
                        </label>
                        <input
                            type="password"
                            className="atmo-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button type="submit" className="atmo-btn" style={{ marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--muted)' }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '0.875rem' }}
                    >
                        Create one
                    </button>
                </p>
            </div>

        </div>
    );
}
