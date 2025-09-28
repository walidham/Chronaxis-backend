const mongoose = require('mongoose');
const Session = require('../models/Session');

const exportSessions = async () => {
  let localConnection, atlasConnection;
  
  try {
    // Connect to local database
    console.log('Connecting to local database...');
    localConnection = await mongoose.createConnection('mongodb://admin:iset2024@localhost:27017/university-schedule');
    console.log('✅ Connected to local database');

    // Connect to Atlas database
    console.log('Connecting to Atlas database...');
    atlasConnection = await mongoose.createConnection('mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority&appName=chronaxis');
    console.log('✅ Connected to Atlas database');

    // Create models for both connections
    const LocalSession = localConnection.model('Session', Session.schema);
    const AtlasSession = atlasConnection.model('Session', Session.schema);

    // Count sessions in local database
    const localCount = await LocalSession.countDocuments();
    console.log(`📊 Local sessions count: ${localCount}`);

    // Count sessions in Atlas database
    const atlasCount = await AtlasSession.countDocuments();
    console.log(`📊 Atlas sessions count: ${atlasCount}`);

    if (localCount === atlasCount) {
      console.log('✅ All sessions are already exported');
      return;
    }

    // Clear Atlas sessions
    console.log('🗑️ Clearing Atlas sessions...');
    await AtlasSession.deleteMany({});

    // Get all local sessions
    console.log('📤 Fetching local sessions...');
    const localSessions = await LocalSession.find({});
    console.log(`Found ${localSessions.length} sessions in local database`);

    // Export sessions in batches
    const batchSize = 50;
    for (let i = 0; i < localSessions.length; i += batchSize) {
      const batch = localSessions.slice(i, i + batchSize);
      await AtlasSession.insertMany(batch);
      console.log(`   ✅ Exported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(localSessions.length/batchSize)} (${batch.length} sessions)`);
    }

    // Verify export
    const finalCount = await AtlasSession.countDocuments();
    console.log(`\n🎉 Export completed! ${finalCount} sessions exported to Atlas`);

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    console.log('Database connections closed');
  }
};

exportSessions();