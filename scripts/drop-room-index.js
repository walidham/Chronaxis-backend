const mongoose = require('mongoose');
require('dotenv').config();

const dropRoomIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('sessions');

    // List all indexes first
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(idx => idx.name));

    // Drop any room-related indexes
    const roomIndexNames = indexes
      .filter(idx => idx.name.includes('room'))
      .map(idx => idx.name);

    for (const indexName of roomIndexNames) {
      try {
        await collection.dropIndex(indexName);
        console.log(`Dropped index: ${indexName}`);
      } catch (error) {
        console.log(`Could not drop index ${indexName}:`, error.message);
      }
    }

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error dropping room indexes:', error);
    process.exit(1);
  }
};

dropRoomIndex();