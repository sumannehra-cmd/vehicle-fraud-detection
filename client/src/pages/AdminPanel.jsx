import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminPanel() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/auth/users')
            .then(res => setUsers(res.data))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, []);

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
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, i) => (
                            <tr key={user._id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                <td style={{ padding: 12 }}>{user.name}</td>
                                <td style={{ padding: 12 }}>{user.email}</td>
                                <td style={{ padding: 12 }}>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}