const User = require('../models/user');

async function doregister(data) {
    try {
        // Ensure the required fields are present
        const { email, phoneNumber, fullName, batch, department, address } = data;
        if (!email || !phoneNumber) {
            throw new Error('Email and phone number are required');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
        if (existingUser) {
            return false; // User already exists
        }

        // Create a new user (without password, as per your requirement)
        const newUser = new User({
            email,
            phoneNumber,
            fullName,
            batch,
            department,
            address,
            // Password is not included here
        });

        await newUser.save();
        return true; // Registration successful
    } catch (err) {
        console.error('Error during registration:', err);
        throw new Error('Unable to create account');
    }
}

async function createAdminAccounts() {
    try {
        // List of admin users to create
        const adminUsers = [
            { email: 'safeelsaffsf@gmail.com', phoneNumber: '123' },
        ];

        for (const userData of adminUsers) {
            // Check if the admin user already exists
            const existingAdmin = await User.findOne({ email: userData.email });
            if (!existingAdmin) {
                const adminUser = new User({
                    ...userData,
                    role: 'admin', // Set role as admin
                    // Other fields can be set as needed
                });
                await adminUser.save();
            }
        }
        console.log('Admin accounts created successfully');
    } catch (err) {
        console.error('Error during admin creation:', err);
        throw new Error('Unable to create admin accounts');
    }
}

module.exports = {
    doregister,
    createAdminAccounts,
};
