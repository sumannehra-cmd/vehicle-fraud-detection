import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function ClaimsList() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/claims/my')
            .then(res => setClaims(res.data))
            .catch(() => setClaims([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>My Claims</h2>
                <Link to="/claims/new" style={{
                    background: '#3498db', color: 'white',
                    padding: '8px 16px', borderRadius: 4,
                    textDecoration: 'none'
                }}>
                    + New Claim
                </Link>
            </div>

            {loading ? <p>Loading...</p> : claims.length === 0 ? (
                <p>No claims found. <Link to="/claims/new">File your first claim</Link></p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                    <thead>
                        <tr style={{ background: '#1a1a2e', color: 'white' }}>
                            <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Amount</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Fraud Score</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Result</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claims.map((claim, i) => (
                            <tr key={claim._id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                                <td style={{ padding: 12 }}>{new Date(claim.incidentDate).toLocaleDateString()}</td>
                                <td style={{ padding: 12 }}>₹{claim.amount}</td>
                                <td style={{ padding: 12 }}>{claim.status}</td>
                                <td style={{ padding: 12 }}>{claim.fraudScore ?? 'N/A'}/100</td>
                                <td style={{ padding: 12 }}>
                                    <span style={{
                                        background: claim.isFraudulent ? '#e74c3c' : '#2ecc71',
                                        color: 'white', padding: '4px 10px', borderRadius: 12
                                    }}>
                                        {claim.isFraudulent ? 'Fraudulent' : 'Legitimate'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}