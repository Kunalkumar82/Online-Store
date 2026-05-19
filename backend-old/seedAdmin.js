const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/divine_idol_store');
        console.log('MongoDB connected...');

        // Check if admin already exists
        const adminExists = await Admin.findOne({ username: 'admin' });

        if (adminExists) {
            console.log('Admin user already exists! Username: admin');
            process.exit();
        }

        const admin = new Admin({
            username: 'admin',
            password: 'password123'
        });

        await admin.save();
        console.log('Admin Created Successfully!');
        console.log('---------------------------');
        console.log('Username: admin');
        console.log('Password: password123');
        console.log('---------------------------');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

seedAdmin();
