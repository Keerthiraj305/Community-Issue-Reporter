const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Issue = require('./models/Issue');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    // Clear existing data
    await User.deleteMany();
    await Issue.deleteMany();

    // Create users
    const users = await User.create([
      { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'admin' },
      { name: 'John Doe', email: 'john@example.com', password: 'password123', ward: 'Koramangala' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', ward: 'Indiranagar' },
      { name: 'Sam Wilson', email: 'sam@example.com', password: 'password123', ward: 'HSR Layout' }
    ]);

    const adminUser = users[0];
    const userOne = users[1];
    const userTwo = users[2];
    const userThree = users[3];

    // Create issues
    const issues = [
      {
        title: 'Large pothole on 80ft road',
        description: 'A very large and dangerous pothole has formed on the main 80ft road near the signal. It is causing traffic jams and is a hazard for two-wheelers.',
        location: 'Koramangala 4th Block',
        category: 'Road',
        priority: 'High',
        status: 'Open',
        reportedBy: userOne._id,
        ward: 'Koramangala',
        pincode: '560034'
      },
      {
        title: 'Street light not working for a week',
        description: 'The street light on 12th main Indiranagar has been out for over a week. It is very dark and unsafe at night.',
        location: '12th Main, Indiranagar',
        category: 'Street Light',
        priority: 'Medium',
        status: 'In Progress',
        assignedTo: adminUser._id,
        reportedBy: userTwo._id,
        ward: 'Indiranagar',
        pincode: '560038'
      },
      {
        title: 'Garbage not collected from 27th Main',
        description: 'The garbage bins on 27th Main HSR Layout are overflowing. They have not been cleared for 3 days and the smell is unbearable.',
        location: '27th Main, HSR Layout Sector 1',
        category: 'Garbage',
        priority: 'High',
        status: 'Open',
        reportedBy: userThree._id,
        ward: 'HSR Layout',
        pincode: '560102'
      },
      {
        title: 'Broken sewage drain cover',
        description: 'A sewage drain cover is broken on the footpath, creating a dangerous hole. Someone could easily fall in.',
        location: 'Near BDA Complex, Koramangala',
        category: 'Drainage',
        priority: 'Critical',
        status: 'Under Review',
        assignedTo: adminUser._id,
        reportedBy: userOne._id,
        ward: 'Koramangala',
        pincode: '560034',
        isUrgent: true
      },
    ];

    await Issue.insertMany(issues);

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await User.deleteMany();
    await Issue.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 