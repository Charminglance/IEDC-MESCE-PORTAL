const bcrypt = require('bcrypt'); // Add this line
const User = require('../models/user');
const Admin = require('../models/admin'); // Import the new Admin model
const Member = require('../models/member');

// Function to handle user registration
const doregister = async (data) => {
    try {
      // Check if user with the same email or phone number already exists
      const existingUser = await User.findOne({
        $or: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
      });
  
      if (existingUser) {
        console.log('User already exists:', existingUser.email, existingUser.phoneNumber);
        return false; // User already exists
      }
  
      // Create new user
      const newUser = new User({
        ...data,
        role: 'registration', // Ensure this role is set for new users
      });
  
      await newUser.save();
      console.log('New user registered:', newUser.email);
      return true; // Registration successful
    } catch (error) {
      console.error('Error during registration:', error);
      return false; // Registration failed
    }
  };
  

// Function to move approved registrations to 'members'
async function moveDataToMembers() {
  try {
    // Find all users with role 'registration'
    const registrations = await User.find({ role: 'registration' });

    for (const user of registrations) {
      // Create a new member document
      const member = new Member({
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: 'member',
        fullName: user.fullName,
        batch: user.batch,
        department: user.department,
        address: user.address,
      });

      // Save the member document to the 'members' collection
      await member.save();

      // Remove the user from the 'users' collection
      await User.deleteOne({ _id: user._id });

      console.log('User moved to members:', user.email);
    }
  } catch (error) {
    console.error('Error moving data to members:', error);
  }
}

// Function to create admin accounts
async function createAdminAccounts() {
  const admins = [
    { email: 'admin2@example.com', password: 'yourPassword2' },
    // Add more admin accounts as needed
  ];

  try {
    for (const admin of admins) {
      const existingAdmin = await Admin.findOne({ email: admin.email });
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(admin.password, 10);
        const newAdmin = new Admin({
          email: admin.email,
          password: hashedPassword,
        });

        await newAdmin.save();
        console.log('Admin account created:', admin.email);
      } else {
        console.log('Admin account already exists for:', admin.email);
      }
    }
  } catch (error) {
    console.error('Error creating admin accounts:', error);
  }
}

module.exports = { doregister, moveDataToMembers, createAdminAccounts };
