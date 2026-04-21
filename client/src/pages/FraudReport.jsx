import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function FraudReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ✅ Fixed: was '/claims/fraud-report', correct endpoint is '/fraud/flagged'
        api.get('/fraud/flagged')
            .then(res => setReports(res.data))
            .catch(() => setReports([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Fraud Report</h2>
            {loading ? <p>Loading...</p> : reports.length === 0 ? (
                <p>No fraudulent claims found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}>
                    <thead>
                        <tr style={{ background: '#e74c3c', color: 'white' }}>
                            <th style={{ padding: 12, textAlign: 'left' }}>Claim ID</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Claimant</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Vehicle</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Amount</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Fraud Score</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Flags</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((claim, i) => (
                            <tr key={claim._id} style={{ background: i % 2 === 0 ? '#fff5f5' : 'white' }}>
                                <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 12 }}>
                                    {claim._id.slice(-8).toUpperCase()}
                                </td>
                                {/* ✅ populated fields from backend: claimant.name, vehicle.registrationNo */}
                                <td style={{ padding: 12 }}>{claim.claimant?.name || 'N/A'}</td>
                                <td style={{ padding: 12 }}>{claim.vehicle?.registrationNo || 'N/A'}</td>
                                <td style={{ padding: 12 }}>₹{claim.claimAmount?.toLocaleString()}</td>
                                <td style={{ padding: 12 }}>
                                    <span style={{
                                        background: claim.fraudScore >= 75 ? '#e74c3c' : '#f39c12',
                                        color: 'white', padding: '3px 10px', borderRadius: 12, fontSize: 13
                                    }}>
                                        {claim.fraudScore}/100
                                    </span>
                                </td>
                                <td style={{ padding: 12 }}>
                                    {claim.fraudFlags?.map((f, i) => (
                                        <span key={i} style={{ color: 'red', marginRight: 6, fontSize: 13 }}>⚠ {f}</span>
                                    ))}
                                </td>
                                <td style={{ padding: 12 }}>{claim.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}