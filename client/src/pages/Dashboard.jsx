import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../api/axios';

const COLORS = ['#2ecc71', '#e74c3c'];

export default function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/claims/stats')
            .then(res => setStats(res.data))
            .catch(() => setStats(null));
    }, []);

    const pieData = stats ? [
        { name: 'Legitimate', value: stats.legitimate },
        { name: 'Fraudulent', value: stats.fraudulent }
    ] : [];

    const barData = stats?.byVehicleType || [];

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Fraud Detection Dashboard</h2>

            {!stats ? (
                <p>Loading stats...</p>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginBottom: 40 }}>
                        <div style={{ background: '#1a1a2e', color: 'white', padding: 20, borderRadius: 8, minWidth: 160 }}>
                            <h3>Total Claims</h3>
                            <p style={{ fontSize: 32 }}>{stats.total}</p>
                        </div>
                        <div style={{ background: '#e74c3c', color: 'white', padding: 20, borderRadius: 8, minWidth: 160 }}>
                            <h3>Fraudulent</h3>
                            <p style={{ fontSize: 32 }}>{stats.fraudulent}</p>
                        </div>
                        <div style={{ background: '#2ecc71', color: 'white', padding: 20, borderRadius: 8, minWidth: 160 }}>
                            <h3>Legitimate</h3>
                            <p style={{ fontSize: 32 }}>{stats.legitimate}</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
                        <div>
                            <h3>Fraud vs Legitimate</h3>
                            <PieChart width={300} height={300}>
                                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>

                        <div>
                            <h3>Claims by Vehicle Type</h3>
                            <ResponsiveContainer width={400} height={300}>
                                <BarChart data={barData}>
                                    <XAxis dataKey="type" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#3498db" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}