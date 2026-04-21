import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <>
            <nav className="topbar">
                <div className="topbar-left">
                    <div className="hamburger" onClick={() => setOpen(!open)}>
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </div>

                    <Link to="/dashboard" className="brand">
                        FraudGuard
                    </Link>
                </div>

                {user && <span className="user-text">Hi, {user.name}</span>}
            </nav>

            {user && (
                <>
                    <div className={`sidebar ${open ? 'open' : ''}`}>
                        <Link to="/claims/new" className="sidebar-link" onClick={() => setOpen(false)}>
                            File Claim
                        </Link>

                        <Link to="/claims/my" className="sidebar-link" onClick={() => setOpen(false)}>
                            My Claims
                        </Link>

                        {user.role === 'admin' && (
                            <Link to="/admin" className="sidebar-link" onClick={() => setOpen(false)}>
                                Admin Panel
                            </Link>
                        )}

                        <div
                            className="sidebar-link logout"
                            onClick={async () => {
                                setOpen(false);
                                await handleLogout();
                            }}
                        >
                            Logout
                        </div>
                    </div>

                    {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}
                </>
            )}
        </>
    );
}