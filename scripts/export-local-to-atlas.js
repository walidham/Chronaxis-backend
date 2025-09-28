const mongoose = require('mongoose');

// Import all models
const University = require('../models/University');
const Department = require('../models/Department');
const Track = require('../models/Track');
const Grade = require('../models/Grade');
const AcademicYear = require('../models/AcademicYear');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Session = require('../models/Session');
const User = require('../models/User');

const exportToAtlas = async () => {
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
    const LocalModels = {
      University: localConnection.model('University', University.schema),
      Department: localConnection.model('Department', Department.schema),
      Track: localConnection.model('Track', Track.schema),
      Grade: localConnection.model('Grade', Grade.schema),
      AcademicYear: localConnection.model('AcademicYear', AcademicYear.schema),
      Teacher: localConnection.model('Teacher', Teacher.schema),
      Room: localConnection.model('Room', Room.schema),
      Course: localConnection.model('Course', Course.schema),
      Class: localConnection.model('Class', Class.schema),
      Session: localConnection.model('Session', Session.schema),
      User: localConnection.model('User', User.schema)
    };

    const AtlasModels = {
      University: atlasConnection.model('University', University.schema),
      Department: atlasConnection.model('Department', Department.schema),
      Track: atlasConnection.model('Track', Track.schema),
      Grade: atlasConnection.model('Grade', Grade.schema),
      AcademicYear: atlasConnection.model('AcademicYear', AcademicYear.schema),
      Teacher: atlasConnection.model('Teacher', Teacher.schema),
      Room: atlasConnection.model('Room', Room.schema),
      Course: atlasConnection.model('Course', Course.schema),
      Class: atlasConnection.model('Class', Class.schema),
      Session: atlasConnection.model('Session', Session.schema),
      User: atlasConnection.model('User', User.schema)
    };

    // Clear Atlas database
    console.log('\n🗑️ Clearing Atlas database...');
    for (const [modelName, Model] of Object.entries(AtlasModels)) {
      await Model.deleteMany({});
      console.log(`   Cleared ${modelName}`);
    }

    // Export data in correct order (dependencies first)
    const exportOrder = [
      'University', 'Department', 'Track', 'Grade', 'AcademicYear', 
      'Teacher', 'Room', 'Course', 'Class', 'Session', 'User'
    ];

    console.log('\n📤 Exporting data...');
    for (const modelName of exportOrder) {
      const localData = await LocalModels[modelName].find({});
      if (localData.length > 0) {
        await AtlasModels[modelName].insertMany(localData);
        console.log(`   ✅ Exported ${localData.length} ${modelName}(s)`);
      } else {
        console.log(`   ⚠️ No ${modelName} data found`);
      }
    }

    console.log('\n🎉 Export completed successfully!');

  } catch (error) {
    console.error('❌ Export failed:', error);
  } finally {
    if (localConnection) await localConnection.close();
    if (atlasConnection) await atlasConnection.close();
    console.log('Database connections closed');
  }
};

exportToAtlas();