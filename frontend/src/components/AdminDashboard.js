import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard({ user, onLogout }) {
    const [assets, setAssets] = useState([]);
    const [newAsset, setNewAsset] = useState({
        name: '',
        type: 'Laptop',
        status: 'Available',
        specifications: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('/api/assets');
            setAssets(response.data);
            setLoading(false);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error fetching assets' });
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setNewAsset({
            ...newAsset,
            [e.target.name]: e.target.value
        });
    };

    const handleAddAsset = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/assets', newAsset);
            setMessage({ type: 'success', text: 'Asset added successfully!' });
            setNewAsset({
                name: '',
                type: 'Laptop',
                status: 'Available',
                specifications: ''
            });
            fetchAssets();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'danger', text: 'Error adding asset' });
        }
    };

    const handleDeleteAsset = async (id) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(`/api/assets/${id}`);
                setMessage({ type: 'success', text: 'Asset deleted successfully!' });
                fetchAssets();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (error) {
                setMessage({ type: 'danger', text: 'Error deleting asset' });
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>📊 Admin Dashboard</h1>
                <div className="user-info">
                    <span className="user-badge">👤 {user.username}</span>
                    <button className="btn btn-secondary" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            <div className="add-asset-section">
                <h2>➕ Add New Asset</h2>
                <form onSubmit={handleAddAsset}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Asset Name</label>
                            <input
                                type="text"
                                name="name"
                                value={newAsset.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Dell Latitude 5520"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                                name="type"
                                value={newAsset.type}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Laptop">Laptop</option>
                                <option value="Monitor">Monitor</option>
                                <option value="License">License</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="status"
                                value={newAsset.status}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Available">Available</option>
                                <option value="Assigned">Assigned</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Specifications</label>
                        <textarea
                            name="specifications"
                            value={newAsset.specifications}
                            onChange={handleInputChange}
                            placeholder="e.g., i7-11th Gen, 16GB RAM, 512GB SSD"
                            rows="3"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Add Asset
                    </button>
                </form>
            </div>

            <div className="add-asset-section">
                <h2>📦 Asset Inventory ({assets.length} items)</h2>

                {loading ? (
                    <p>Loading assets...</p>
                ) : assets.length === 0 ? (
                    <div className="empty-state">
                        <h3>No Assets Found</h3>
                        <p>Start by adding your first asset above.</p>
                    </div>
                ) : (
                    <div className="assets-grid">
                        {assets.map((asset) => (
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
                                        {asset.status}
                                    </span>
                                </div>
                                <div style={{ marginTop: '15px' }}>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteAsset(asset._id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
