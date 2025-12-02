import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EmployeeDashboard({ user, onLogout }) {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('/api/assets');
            setAssets(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setLoading(false);
        }
    };

    const filteredAssets = filter === 'All'
        ? assets
        : assets.filter(asset => asset.type === filter);

    const availableCount = assets.filter(a => a.status === 'Available').length;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>👨‍💼 Employee Dashboard</h1>
                <div className="user-info">
                    <span className="user-badge">👤 {user.username}</span>
                    <button className="btn btn-secondary" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <div className="add-asset-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2>📦 Available Assets</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            className={`btn ${filter === 'All' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('All')}
                        >
                            All
                        </button>
                        <button
                            className={`btn ${filter === 'Laptop' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('Laptop')}
                        >
                            Laptops
                        </button>
                        <button
                            className={`btn ${filter === 'Monitor' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('Monitor')}
                        >
                            Monitors
                        </button>
                        <button
                            className={`btn ${filter === 'License' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('License')}
                        >
                            Licenses
                        </button>
                    </div>
                </div>

                <div className="alert alert-info" role="alert">
                    📊 Total Assets: <strong>{assets.length}</strong> | Available: <strong>{availableCount}</strong>
                </div>

                {loading ? (
                    <p>Loading assets...</p>
                ) : filteredAssets.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Assets Found</h3>
                        <p>No {filter !== 'All' ? filter : ''} assets available at the moment.</p>
                    </div>
                ) : (
                    <div className="assets-grid">
                        {filteredAssets.map((asset) => (
                            <div key={asset._id} className="asset-card">
                                <span className={`asset-type-badge type-${asset.type.toLowerCase()}`}>
                                    {asset.type}
                                </span>
                                <h3>{asset.name}</h3>
                                <div className="asset-info">
                                    <strong>Specifications:</strong> {asset.specifications}
                                </div>
                                <div className="asset-info">
                                    <strong>Status:</strong>
                                    <span className={`status-badge status-${asset.status.toLowerCase()}`}>
                                        {asset.status === 'Available' ? '✅ ' : asset.status === 'Assigned' ? '👤 ' : '🔧 '}
                                        {asset.status}
                                    </span>
                                </div>
                                {asset.status === 'Available' && (
                                    <div style={{ marginTop: '15px' }}>
                                        <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                            ✓ Ready to assign
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeDashboard;
