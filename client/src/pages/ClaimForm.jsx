import { useState } from 'react';
import api from '../api/axios';
import '../App.css';

const steps = ['Incident Details', 'Vehicle & Policy', 'Review & Submit'];

function StepIndicator({ current }) {
    return (
        <div className="step-indicator">
            {steps.map((step, index) => (
                <div
                    key={step}
                    className={`step-item ${index < steps.length - 1 ? 'step-item-grow' : ''}`}
                >
                    <div className="step-node-wrap">
                        <div
                            className={`step-node ${index <= current ? 'active' : 'inactive'
                                }`}
                        >
                            {index + 1}
                        </div>

                        <span
                            className={`step-label ${index <= current ? 'active' : 'inactive'
                                }`}
                        >
                            {step}
                        </span>
                    </div>

                    {
                        index < steps.length - 1 && (
                            <div className="step-line" />
                        )
                    }
                </div>
            ))
            }
        </div >
    );
}

function Field({ label, children }) {
    return (
        <div className="field">
            <label className="field-label">{label}</label>
            {children}
        </div>
    );
}

function ReviewRow({ label, value, isLast = false }) {
    return (
        <div className={`review-row ${isLast ? 'last' : ''}`}>
            <span className="review-row-label">{label}</span>
            <span className="review-row-value">{value}</span>
        </div>
    );
}

export default function ClaimForm() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({
        vehicleId: '',
        policyId: '',
        incidentDate: '',
        description: '',
        amount: '',
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/claims', {
                vehicle: form.vehicleId,
                policy: form.policyId,
                incidentDate: form.incidentDate,
                description: form.description,
                amount: Number(form.amount),
            });

            setResult(res.data);

        } catch (err) {
            console.error('Claim submission failed:', err);

            setError('Failed to submit claim. Please check inputs.');

        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setResult(null);
        setStep(0);
        setForm({
            vehicleId: '',
            policyId: '',
            incidentDate: '',
            description: '',
            amount: '',
        });
    };

    if (result) {
        const isLegit = !result.isFraudulent;
        const score = result.fraudScore ?? 0;
        const scoreClass =
            score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
        const circumference = 2 * Math.PI * 48;
        const dashOffset = circumference * (1 - score / 100);

        return (
            <div className="app-page">
                <div className="page-shell form-shell">
                    <div className="card card-large center-card result-card">
                        <div className={`result-icon ${isLegit ? 'safe' : 'fraud'}`}>
                            {isLegit ? '✓' : '⚠'}
                        </div>

                        <h2 className={`result-title ${isLegit ? 'safe' : 'fraud'}`}>
                            {isLegit ? 'Claim Submitted' : 'Claim Flagged'}
                        </h2>

                        <p className="result-subtitle">
                            {isLegit
                                ? 'Your claim is under review.'
                                : 'This claim has been flagged for investigation.'}
                        </p>

                        <div className="score-ring-wrap">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="48"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.06)"
                                    strokeWidth="8"
                                />
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="48"
                                    fill="none"
                                    className={`score-ring-circle ${scoreClass}`}
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                    transform="rotate(-90 60 60)"
                                />
                            </svg>

                            <div className="score-ring-center">
                                <span className={`score-ring-value ${scoreClass}`}>{score}</span>
                                <span className="score-ring-label">Fraud Score</span>
                            </div>
                        </div>

                        <div className="result-status-pill">
                            {result.status?.toUpperCase()}
                        </div>

                        {result.fraudFlags?.length > 0 && (
                            <div className="fraud-flags-list">
                                {result.fraudFlags.map((flag, index) => (
                                    <div key={index} className="fraud-flag-item">
                                        <span className="fraud-flag-icon">⚠</span>
                                        <span className="fraud-flag-text">{flag}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="button" className="btn btn-primary result-btn" onClick={resetForm}>
                            File Another Claim
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const stepOneValid =
        form.incidentDate && form.amount && form.description;
    const stepTwoValid = form.vehicleId;

    return (
        <div className="app-page">
            <div className="page-shell form-shell">
                <div className="card card-large center-card">
                    <div className="form-header">
                        <p className="page-eyebrow">Insurance Portal</p>
                        <h1 className="page-title">File a Claim</h1>
                        <p className="page-subtitle">
                            Complete all steps to submit your claim
                        </p>
                    </div>

                    <StepIndicator current={step} />
                    <div className="form-divider" />

                    {step === 0 && (
                        <div>
                            <Field label="Incident Date">
                                <input
                                    type="date"
                                    className="input"
                                    value={form.incidentDate}
                                    onChange={(e) => set('incidentDate', e.target.value)}
                                    required
                                />
                            </Field>

                            <Field label="Claim Amount (₹)">
                                <input
                                    type="number"
                                    className="input"
                                    placeholder="e.g. 75000"
                                    value={form.amount}
                                    onChange={(e) => set('amount', e.target.value)}
                                    required
                                />
                            </Field>

                            <Field label="Incident Description">
                                <textarea
                                    className="textarea textarea-resizable"
                                    placeholder="Describe what happened in detail…"
                                    rows={4}
                                    value={form.description}
                                    onChange={(e) => set('description', e.target.value)}
                                    required
                                />
                            </Field>

                            <button
                                type="button"
                                className={`btn btn-primary btn-full ${!stepOneValid ? 'btn-disabled' : ''}`}
                                onClick={() => setStep(1)}
                                disabled={!stepOneValid}
                            >
                                Continue →
                            </button>
                        </div>
                    )}

                    {step === 1 && (
                        <div>
                            <Field label="Vehicle ID">
                                <input
                                    className="input"
                                    placeholder="e.g. VH-2024-001"
                                    value={form.vehicleId}
                                    onChange={(e) => set('vehicleId', e.target.value)}
                                    required
                                />
                            </Field>

                            <Field label="Policy ID">
                                <input
                                    className="input"
                                    placeholder="e.g. PL-2024-001"
                                    value={form.policyId}
                                    onChange={(e) => set('policyId', e.target.value)}
                                />
                            </Field>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setStep(0)}
                                >
                                    ← Back
                                </button>

                                <button
                                    type="button"
                                    className={`btn btn-primary form-actions-grow ${!stepTwoValid ? 'btn-disabled' : ''}`}
                                    onClick={() => setStep(2)}
                                    disabled={!stepTwoValid}
                                >
                                    Review Claim →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <div className="review-card">
                                <ReviewRow
                                    label="Incident Date"
                                    value={
                                        form.incidentDate
                                            ? new Date(form.incidentDate).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })
                                            : '—'
                                    }
                                />
                                <ReviewRow
                                    label="Claim Amount"
                                    value={`₹${Number(form.amount || 0).toLocaleString('en-IN')}`}
                                />
                                <ReviewRow label="Vehicle ID" value={form.vehicleId || '—'} />
                                <ReviewRow label="Policy ID" value={form.policyId || '—'} />
                                <ReviewRow
                                    label="Description"
                                    value={form.description || '—'}
                                    isLast
                                />
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setStep(1)}
                                >
                                    ← Back
                                </button>

                                <button
                                    type="button"
                                    className={`btn btn-primary form-actions-grow ${loading ? 'btn-disabled' : ''}`}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="btn-loading">
                                            <span className="spinner spinner-small" />
                                            Submitting…
                                        </span>
                                    ) : (
                                        'Submit Claim →'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}