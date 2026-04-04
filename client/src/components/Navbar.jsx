import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '1rem 2rem',
            backgroundColor: '#0a0f1e',
            borderBottom: '1px solid #1f2d3d',
            color: 'white'
        }}>
            <Link to="/dashboard" style={{ color: '#00c96f', textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>
                FraudGuard
            </Link>

            {user && (
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Link to="/dashboard" style={{ color: '#9ca3af', textDecoration: 'none' }}>Dashboard</Link>
                    <Link to="/claims/new" style={{ color: '#9ca3af', textDecoration: 'none' }}>File Claim</Link>
                    <Link to="/claims/my" style={{ color: '#9ca3af', textDecoration: 'none' }}>My Claims</Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" style={{ color: '#9ca3af', textDecoration: 'none' }}>Admin</Link>
                    )}
                    <span style={{ color: '#6b7280' }}>Hi, {user.name}</span>
                    <button onClick={handleLogout} style={{
                        background: '#00c96f', color: 'white',
                        border: 'none', padding: '6px 14px',
                        borderRadius: 6, cursor: 'pointer', fontWeight: 600
                    }}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}