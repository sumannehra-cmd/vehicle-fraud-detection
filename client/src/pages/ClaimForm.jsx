import { useState } from 'react';
import api from '../api/axios';

export default function ClaimForm() {
    const [form, setForm] = useState({
        vehicleId: '', policyId: '', incidentDate: '', description: '', amount: ''
    });
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await api.post('/claims', {
            vehicle: form.vehicleId,
            policy: form.policyId,
            incidentDate: form.incidentDate,
            description: form.description,
            amount: Number(form.amount)
        });
        setResult(res.data);
    };

    return (
        <div style={{ maxWidth: 600, margin: '2rem auto', padding: '0 1rem' }}>
            <h2>File a Claim</h2>
            <form onSubmit={handleSubmit}>
                <input placeholder="Vehicle ID" value={form.vehicleId}
                    onChange={e => setForm({ ...form, vehicleId: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
                <input placeholder="Policy ID" value={form.policyId}
                    onChange={e => setForm({ ...form, policyId: e.target.value })}
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="date" value={form.incidentDate}
                    onChange={e => setForm({ ...form, incidentDate: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
                <textarea placeholder="Describe the incident" value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
                <input type="number" placeholder="Claim amount (₹)" value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })} required
                    style={{ display: 'block', width: '100%', marginBottom: 10, padding: 8 }} />
                <button type="submit" style={{ width: '100%', padding: 10 }}>Submit Claim</button>
            </form>

            {result && (
                <div style={{
                    marginTop: '1rem', padding: '1rem',
                    border: `2px solid ${result.isFraudulent ? 'red' : 'green'}`, borderRadius: 8
                }}>
                    <p>Fraud Score: {result.fraudScore}/100</p>
                    <p>Status: {result.status}</p>
                    {result.fraudFlags?.map((f, i) => <p key={i} style={{ color: 'red' }}>⚠ {f}</p>)}
                </div>
            )}
        </div>
    );
}