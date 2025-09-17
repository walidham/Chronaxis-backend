const mongoose = require('mongoose');
require('dotenv').config();

const fixRoomIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('sessions');

    // Drop the old room index
    try {
      await collection.dropIndex('room_1_dayOfWeek_1_timeSlot_1_semester_1');
      console.log('Old room index dropped successfully');
    } catch (error) {
      console.log('Old index may not exist:', error.message);
    }

    // Create new partial index
    await collection.createIndex(
      { room: 1, dayOfWeek: 1, timeSlot: 1, semester: 1 },
      { 
        unique: true, 
        partialFilterExpression: { room: { $exists: true, $ne: null } },
        name: 'room_1_dayOfWeek_1_timeSlot_1_semester_1_partial'
      }
    );
    console.log('New partial room index created successfully');

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error fixing room index:', error);
    process.exit(1);
  }
};

fixRoomIndex();