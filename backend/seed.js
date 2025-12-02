const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/techvault';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB connected'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// Seed users
const seedUsers = async () => {
    try {
        // Check if users already exist
        const adminExists = await User.findOne({ username: 'admin' });
        const employeeExists = await User.findOne({ username: 'employee' });

        if (!adminExists) {
            const adminPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                username: 'admin',
                password: adminPassword,
                role: 'admin'
            });
            console.log('✅ Admin user created');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        if (!employeeExists) {
            const employeePassword = await bcrypt.hash('emp123', 10);
            await User.create({
                username: 'employee',
                password: employeePassword,
                role: 'employee'
            });
            console.log('✅ Employee user created');
        } else {
            console.log('ℹ️  Employee user already exists');
        }

        console.log('\n✅ Database seeding completed!');
        console.log('\nDemo Credentials:');
        console.log('Admin: admin / admin123');
        console.log('Employee: employee / emp123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedUsers();
