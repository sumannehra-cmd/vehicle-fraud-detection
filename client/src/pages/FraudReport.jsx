import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function FraudReport() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/claims/fraud-report')
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
                            <th style={{ padding: 12, textAlign: 'left' }}>Amount</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Fraud Score</th>
                            <th style={{ padding: 12, textAlign: 'left' }}>Flags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((claim, i) => (
                            <tr key={claim._id} style={{ background: i % 2 === 0 ? '#fff5f5' : 'white' }}>
                                <td style={{ padding: 12 }}>{claim._id}</td>
                                <td style={{ padding: 12 }}>₹{claim.amount}</td>
                                <td style={{ padding: 12 }}>{claim.fraudScore}/100</td>
                                <td style={{ padding: 12 }}>
                                    {claim.fraudFlags?.map((f, i) => (
                                        <span key={i} style={{ color: 'red', marginRight: 6 }}>⚠ {f}</span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}