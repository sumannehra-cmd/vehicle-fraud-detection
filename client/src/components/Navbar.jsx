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
            backgroundColor: '#1a1a2e', color: 'white'
        }}>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: 18 }}>
                FraudGuard
            </Link>

            {user && (
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                    <Link to="/claims/new" style={{ color: 'white', textDecoration: 'none' }}>File Claim</Link>
                    <Link to="/claims/my" style={{ color: 'white', textDecoration: 'none' }}>My Claims</Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin</Link>
                    )}
                    <span style={{ color: '#aaa' }}>Hi, {user.name}</span>
                    <button onClick={handleLogout} style={{
                        background: '#e74c3c', color: 'white',
                        border: 'none', padding: '6px 14px',
                        borderRadius: 4, cursor: 'pointer'
                    }}>
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
}