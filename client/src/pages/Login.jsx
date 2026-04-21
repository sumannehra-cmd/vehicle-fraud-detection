import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#0a0f1e'
        }}>
            <div style={{
                background: '#111827', padding: '2.5rem', borderRadius: 16,
                width: '100%', maxWidth: 420, border: '1px solid #1f2d3d',
                boxShadow: '0 0 40px rgba(0,0,0,0.4)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: 56, height: 56, background: '#00c96f22',
                        borderRadius: 14, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 1rem',
                        border: '1px solid #00c96f44'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00c96f" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h2 style={{ color: '#f0f4f8', margin: 0, fontSize: 24, fontWeight: 600 }}>FraudGuard</h2>
                    <p style={{ color: '#6b7280', marginTop: 6, fontSize: 14 }}>Sign in to your account</p>
                </div>

                {error && (
                    <div style={{
                        background: '#ff000015', border: '1px solid #ff000040',
                        color: '#ff6b6b', padding: '10px 14px', borderRadius: 8,
                        marginBottom: 16, fontSize: 14
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 6 }}>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            required
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 8,
                                background: '#1f2937', border: '1px solid #374151',
                                color: '#f0f4f8', fontSize: 14, outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ color: '#9ca3af', fontSize: 13, display: 'block', marginBottom: 6 }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            required
                            style={{
                                width: '100%', padding: '10px 14px', borderRadius: 8,
                                background: '#1f2937', border: '1px solid #374151',
                                color: '#f0f4f8', fontSize: 14, outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <button type="submit" style={{
                        width: '100%', padding: '11px', borderRadius: 8,
                        background: '#00c96f', border: 'none', color: '#fff',
                        fontSize: 15, fontWeight: 600, cursor: 'pointer'
                    }}>
                        Sign In
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#00c96f', textDecoration: 'none', fontWeight: 500 }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}