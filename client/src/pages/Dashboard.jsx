import { useEffect, useMemo, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import api from '../api/axios';
import '../App.css';

const COLORS = ['#10b981', '#f43f5e'];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload || !payload.length) return null;

    return (
        <div className="chart-tooltip">
            {label && <p className="chart-tooltip-label">{label}</p>}
            {payload.map((item, index) => (
                <p
                    key={`${item.name}-${index}`}
                    className="chart-tooltip-item"
                    style={{ color: item.color || '#60a5fa' }}
                >
                    {item.name}: {item.value}
                </p>
            ))}
        </div>
    );
}

function SectionHeader({ title }) {
    return (
        <div className="dashboard-section-header">
            <h3>{title}</h3>
            <div />
        </div>
    );
}

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/fraud/stats')
            .then((res) => setStats(res.data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    const legitimate = useMemo(() => {
        if (!stats) return 0;
        return stats.total - stats.fraudulent;
    }, [stats]);

    const pieData = useMemo(() => {
        if (!stats) return [];
        return [
            { name: 'Legitimate', value: legitimate },
            { name: 'Fraudulent', value: stats.fraudulent },
        ];
    }, [stats, legitimate]);

    const barData = useMemo(() => {
        return stats?.fraudByType?.map((item) => ({
            type: item._id,
            count: item.count,
        })) || [];
    }, [stats]);

    const monthlyData = useMemo(() => {
        return (
            stats?.monthlyFraud
                ?.map((item) => ({
                    month: `${item._id.month}/${item._id.year}`,
                    count: item.count,
                    amount: item.totalAmount,
                }))
                .reverse() || []
        );
    }, [stats]);

    const statCards = useMemo(() => {
        if (!stats) return [];

        return [
            { label: 'Total Claims', value: stats.total, accentClass: 'accent-blue', valueClass: 'text-blue' },
            { label: 'Fraudulent', value: stats.fraudulent, accentClass: 'accent-red', valueClass: 'text-red' },
            { label: 'Legitimate', value: legitimate, accentClass: 'accent-green', valueClass: 'text-green' },
            { label: 'Pending', value: stats.pending, accentClass: 'accent-orange', valueClass: 'text-orange' },
            { label: 'Critical', value: stats.critical, accentClass: 'accent-violet', valueClass: 'text-violet' },
            { label: 'Fraud Rate', value: `${stats.fraudRate}%`, accentClass: 'accent-sky', valueClass: 'text-sky' },
        ];
    }, [stats, legitimate]);

    return (
        <div className="app-page">
            <div className="page-shell">
                <section className="dashboard-hero">
                    <p className="page-eyebrow">Insurance Fraud Detection</p>
                    <h1 className="page-title">Fraud Detection Dashboard</h1>

                    <div className="dashboard-live-row">
                        <div className="dashboard-live-dot" />
                        <span>Live</span>
                    </div>

                    <p className="page-subtitle dashboard-subtitle">
                        Insurance claim anomaly and clustering analysis
                    </p>
                </section>

                {loading ? (
                    <div className="dashboard-loading">
                        <div className="spinner" />
                        <span>Loading statistics...</span>
                    </div>
                ) : !stats ? (
                    <div className="dashboard-empty">
                        <p>Could not load dashboard statistics.</p>
                    </div>
                ) : (
                    <>
                        <section className="grid-cards dashboard-stat-grid">
                            {statCards.map((card) => (
                                <div key={card.label} className="stat-card">
                                    <div className={`stat-card-top ${card.accentClass}`} />
                                    <p className="stat-label">{card.label}</p>
                                    <p className={`stat-value ${card.valueClass}`}>{card.value}</p>
                                </div>
                            ))}
                        </section>

                        <section className="dashboard-chart-grid">
                            <div className="card card-padding dashboard-chart-card dashboard-pie-card">
                                <SectionHeader title="Fraud vs Legitimate" />
                                <div className="dashboard-pie-wrap">
                                    <PieChart width={270} height={270}>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={105}
                                            innerRadius={55}
                                            paddingAngle={3}
                                            label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index]} stroke="transparent" />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend iconType="circle" iconSize={8} />
                                    </PieChart>
                                </div>
                            </div>

                            {barData.length > 0 && (
                                <div className="card card-padding dashboard-chart-card">
                                    <SectionHeader title="Fraud by Incident Type" />
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={barData} barSize={28}>
                                            <XAxis
                                                dataKey="type"
                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            />
                                            <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Cases" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            {monthlyData.length > 0 && (
                                <div className="card card-padding dashboard-chart-card">
                                    <SectionHeader title="Monthly Fraud Trend" />
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={monthlyData} barSize={28}>
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: '#64748b', fontSize: 11 }}
                                                axisLine={false}
                                                tickLine={false}
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            />
                                            <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Fraud Cases" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}