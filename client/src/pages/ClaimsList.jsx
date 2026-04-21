import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import '../App.css';

const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'fraudulent', label: 'Fraudulent' },
];

const statusConfig = {
    pending: { label: 'Pending', className: 'badge-status-pending' },
    approved: { label: 'Approved', className: 'badge-status-approved' },
    rejected: { label: 'Rejected', className: 'badge-status-rejected' },
};

function formatCurrency(value) {
    return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function formatDate(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function FraudMeter({ score = 0 }) {
    const meterClass =
        score >= 70
            ? 'fraud-meter-fill high'
            : score >= 40
                ? 'fraud-meter-fill medium'
                : 'fraud-meter-fill low';

    const scoreClass =
        score >= 70
            ? 'fraud-score-text high'
            : score >= 40
                ? 'fraud-score-text medium'
                : 'fraud-score-text low';

    return (
        <div className="fraud-meter">
            <div className="fraud-meter-track">
                <div className={meterClass} style={{ width: `${score}%` }} />
            </div>
            <span className={scoreClass}>{score}</span>
        </div>
    );
}

function ResultBadge({ isFraudulent }) {
    return (
        <span className={`badge ${isFraudulent ? 'badge-result-fraud' : 'badge-result-safe'}`}>
            {isFraudulent ? '⚠ Fraudulent' : '✓ Legitimate'}
        </span>
    );
}

function StatusBadge({ status }) {
    const config = statusConfig[status] || statusConfig.pending;
    return <span className={`badge ${config.className}`}>{config.label}</span>;
}

export default function ClaimsList() {
    const [claims, setClaims] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
        api.get('/claims')
            .then((res) => {
                const data = res.data;
                setClaims(Array.isArray(data) ? data : data.claims ?? data.data ?? []);
            })
            .catch(() => setClaims([]))
            .finally(() => setLoading(false));
    }, []);

    const filteredClaims = useMemo(() => {
        if (filter === 'all') return claims;
        if (filter === 'fraudulent') return claims.filter((c) => c.isFraudulent);
        return claims.filter((c) => c.status === filter);
    }, [claims, filter]);

    const total = claims.length;
    const pending = claims.filter((c) => c.status === 'pending').length;
    const fraudCount = claims.filter((c) => c.isFraudulent).length;
    const totalAmt = claims.reduce((sum, c) => sum + Number(c.claimAmount ?? c.amount ?? 0), 0);

    const summaryCards = [
        { label: 'Total Claims', value: total, accentClass: 'accent-blue', valueClass: 'text-blue' },
        { label: 'Pending', value: pending, accentClass: 'accent-orange', valueClass: 'text-orange' },
        { label: 'Fraudulent', value: fraudCount, accentClass: 'accent-red', valueClass: 'text-red' },
        { label: 'Total Amount', value: `₹${(totalAmt / 1000).toFixed(0)}K`, accentClass: 'accent-green', valueClass: 'text-green' },
    ];

    return (
        <div className="app-page">
            <div className="page-shell">
                <section className="page-header claims-header">
                    <div>
                        <p className="page-eyebrow">Claims Management</p>
                        <h1 className="page-title">My Claims</h1>
                        <p className="page-subtitle">
                            {total} claim{total !== 1 ? 's' : ''} on your account
                        </p>
                    </div>

                    <Link to="/claims/new" className="btn btn-primary">
                        + File New Claim
                    </Link>
                </section>

                <section className="grid-cards claims-summary-grid">
                    {summaryCards.map((card) => (
                        <div key={card.label} className="stat-card">
                            <div className={`stat-card-top ${card.accentClass}`} />
                            <p className="stat-label">{card.label}</p>
                            <p className={`stat-value ${card.valueClass}`}>{card.value}</p>
                        </div>
                    ))}
                </section>

                <section className="claims-filter-row">
                    {FILTERS.map((item) => {
                        const active = filter === item.key;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`filter-pill ${active ? 'active' : ''}`}
                                onClick={() => setFilter(item.key)}
                            >
                                {item.label}
                            </button>
                        );
                    })}
                </section>

                <section className="card claims-table-card">
                    {loading ? (
                        <div className="claims-empty-state">
                            <div className="spinner" />
                            <span>Loading claims…</span>
                        </div>
                    ) : filteredClaims.length === 0 ? (
                        <div className="claims-empty-state claims-empty-message">
                            <p>No claims match this filter</p>
                            <Link to="/claims/new" className="empty-link">
                                File your first claim →
                            </Link>
                        </div>
                    ) : (
                        <div className="table-wrap">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Fraud Score</th>
                                        <th>Result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClaims.map((claim) => {
                                        const rowClass = hoveredRow === claim._id ? 'table-row-hovered' : '';

                                        return (
                                            <tr
                                                key={claim._id}
                                                className={rowClass}
                                                onMouseEnter={() => setHoveredRow(claim._id)}
                                                onMouseLeave={() => setHoveredRow(null)}
                                            >
                                                <td className="claims-date-cell">{formatDate(claim.incidentDate)}</td>
                                                <td className="claims-amount-cell">
                                                    {formatCurrency(claim.claimAmount ?? claim.amount)}
                                                </td>
                                                <td>
                                                    <StatusBadge status={claim.status} />
                                                </td>
                                                <td>
                                                    <FraudMeter score={claim.fraudScore ?? 0} />
                                                </td>
                                                <td>
                                                    <ResultBadge isFraudulent={claim.isFraudulent} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}