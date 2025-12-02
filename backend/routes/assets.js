const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// Get all assets
router.get('/', async (req, res) => {
    try {
        const assets = await Asset.find().sort({ createdAt: -1 });
        res.json(assets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assets', error: error.message });
    }
});

// Get single asset
router.get('/:id', async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
        res.json(asset);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching asset', error: error.message });
    }
});

// Add new asset (Admin only)
router.post('/', async (req, res) => {
    try {
        const { name, type, status, specifications } = req.body;

        const newAsset = new Asset({
            name,
            type,
            status: status || 'Available',
            specifications
        });

        const savedAsset = await newAsset.save();
        res.status(201).json(savedAsset);
    } catch (error) {
        res.status(400).json({ message: 'Error creating asset', error: error.message });
    }
});

// Get analytics data
router.get('/analytics', async (req, res) => {
    try {
        const totalAssets = await Asset.countDocuments();

        // Count by type
        const laptops = await Asset.countDocuments({ type: 'Laptop' });
        const monitors = await Asset.countDocuments({ type: 'Monitor' });
        const licenses = await Asset.countDocuments({ type: 'License' });

        // Count by status
        const available = await Asset.countDocuments({ status: 'Available' });
        const assigned = await Asset.countDocuments({ status: 'Assigned' });
        const maintenance = await Asset.countDocuments({ status: 'Maintenance' });

        // Recent assets (last 5)
        const recentAssets = await Asset.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name type createdAt');

        const analytics = {
            total: totalAssets,
            byType: {
                Laptop: laptops,
                Monitor: monitors,
                License: licenses
            },
            byStatus: {
                Available: available,
                Assigned: assigned,
                Maintenance: maintenance
            },
            recentAssets
        };

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
});

// Update asset
router.put('/:id', async (req, res) => {
    try {
        const updatedAsset = await Asset.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.json(updatedAsset);
    } catch (error) {
        res.status(400).json({ message: 'Error updating asset', error: error.message });
    }
});

// Delete asset (Admin only)
router.delete('/:id', async (req, res) => {
    try {
        const deletedAsset = await Asset.findByIdAndDelete(req.params.id);

        if (!deletedAsset) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        res.json({ message: 'Asset deleted successfully', asset: deletedAsset });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting asset', error: error.message });
    }
});

module.exports = router;
