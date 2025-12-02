import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

function Analytics({ user, onLogout }) {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/assets/analytics');
            setAnalytics(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching analytics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-container">Loading analytics...</div>;
    }

    if (!analytics) {
        return <div className="dashboard-container">No data available</div>;
    }

    // Chart data for asset types
    const typeChartData = {
        labels: ['Laptops', 'Monitors', 'Licenses'],
        datasets: [
            {
                label: 'Assets by Type',
                data: [
                    analytics.byType.Laptop,
                    analytics.byType.Monitor,
                    analytics.byType.License
                ],
                backgroundColor: [
                    'rgba(25, 118, 210, 0.8)',
                    'rgba(123, 31, 162, 0.8)',
                    'rgba(56, 142, 60, 0.8)'
                ],
                borderColor: [
                    'rgba(25, 118, 210, 1)',
                    'rgba(123, 31, 162, 1)',
                    'rgba(56, 142, 60, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    // Chart data for status
    const statusChartData = {
        labels: ['Available', 'Assigned', 'Maintenance'],
        datasets: [
            {
                label: 'Assets by Status',
                data: [
                    analytics.byStatus.Available,
                    analytics.byStatus.Assigned,
                    analytics.byStatus.Maintenance
                ],
                backgroundColor: [
                    'rgba(46, 125, 50, 0.8)',
                    'rgba(245, 127, 23, 0.8)',
                    'rgba(216, 67, 21, 0.8)'
                ],
                borderColor: [
                    'rgba(46, 125, 50, 1)',
                    'rgba(245, 127, 23, 1)',
                    'rgba(216, 67, 21, 1)'
                ],
                borderWidth: 2
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📊 Analytics Dashboard</h1>
                <div className="user-info">
                    <span className="user-badge">👤 {user.username}</span>
                    <button className="btn btn-secondary" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{analytics.total}</h3>
                        <p>Total Assets</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{analytics.byStatus.Available}</h3>
                        <p>Available</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">👤</div>
                    <div className="stat-info">
                        <h3>{analytics.byStatus.Assigned}</h3>
                        <p>Assigned</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🔧</div>
                    <div className="stat-info">
                        <h3>{analytics.byStatus.Maintenance}</h3>
                        <p>In Maintenance</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Assets by Type</h3>
                    <div className="chart-container">
                        <Pie data={typeChartData} options={chartOptions} />
                    </div>
                </div>

                <div className="chart-card">
                    <h3>Assets by Status</h3>
                    <div className="chart-container">
                        <Bar data={statusChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Assets */}
            <div className="add-asset-section">
                <h2>📅 Recently Added Assets</h2>
                {analytics.recentAssets.length === 0 ? (
                    <p>No recent assets</p>
                ) : (
                    <div className="recent-assets-list">
                        {analytics.recentAssets.map((asset) => (
                            <div key={asset._id} className="recent-asset-item">
                                <span className={`asset-type-badge type-${asset.type.toLowerCase()}`}>
                                    {asset.type}
                                </span>
                                <strong>{asset.name}</strong>
                                <span className="asset-date">
                                    {new Date(asset.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Analytics;
