import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Fixed: was '/auth/users', correct endpoint is '/users'
        api.get('/users')
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        try {
            const { data } = await api.put(`/users/${id}/status`, { isActive: !currentStatus });
            setUsers(prev => prev.map(u => u._id === id ? data : u));
        } catch {
            alert('Failed to update user status');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Admin Panel</h2>
            {loading ? <p>Loading...</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                    <thead>
                        <tr style={{ background: '#1a1a2e', color: 'white' }}>
                            <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Role</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr key={user._id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                <td style={{ padding: 12 }}>{user.name}</td>
                                <td style={{ padding: 12 }}>{user.email}</td>
                                <td style={{ padding: 12 }}>{user.role}</td>
                                <td style={{ padding: 12 }}>
                                    <span style={{
                                        background: user.isActive ? '#2ecc71' : '#e74c3c',
                                        color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 13
                                    }}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td style={{ padding: 12 }}>
                                    <button
                                        onClick={() => toggleStatus(user._id, user.isActive)}
                                        style={{
                                            padding: '4px 12px', borderRadius: 6, border: 'none',
                                            cursor: 'pointer', fontSize: 13,
                                            background: user.isActive ? '#e74c3c' : '#2ecc71', color: 'white'
                                        }}
                                    >
                                        {user.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}