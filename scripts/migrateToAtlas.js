const mongoose = require('mongoose');

// Configuration
const LOCAL_URI = 'mongodb://localhost:27017/university-schedule';
const ATLAS_URI = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority';

// Modèles
const User = require('../models/User');
const Department = require('../models/Department');
const Course = require('../models/Course');
const Class = require('../models/Class');
const Teacher = require('../models/Teacher');
const Room = require('../models/Room');
const Session = require('../models/Session');
const Grade = require('../models/Grade');
const AcademicYear = require('../models/AcademicYear');

const models = {
  users: User,
  departments: Department,
  courses: Course,
  classes: Class,
  teachers: Teacher,
  rooms: Room,
  sessions: Session,
  grades: Grade,
  academicyears: AcademicYear
};

async function migrateData() {
  try {
    console.log('🚀 Début de la migration...');
    
    // Connexion à la base locale
    console.log('📡 Connexion à la base locale...');
    const localConn = await mongoose.createConnection(LOCAL_URI);
    
    // Connexion à Atlas
    console.log('☁️ Connexion à Atlas...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI);
    
    for (const [collectionName, Model] of Object.entries(models)) {
      try {
        console.log(`📤 Migration de ${collectionName}...`);
        
        // Lire depuis local
        const LocalModel = localConn.model(Model.modelName, Model.schema);
        const data = await LocalModel.find({});
        
        if (data.length === 0) {
          console.log(`⚠️ Aucune donnée trouvée pour ${collectionName}`);
          continue;
        }
        
        // Écrire vers Atlas
        const AtlasModel = atlasConn.model(Model.modelName, Model.schema);
        await AtlasModel.deleteMany({}); // Vider la collection
        await AtlasModel.insertMany(data);
        
        console.log(`✅ ${collectionName}: ${data.length} documents migrés`);
      } catch (error) {
        console.error(`❌ Erreur pour ${collectionName}:`, error.message);
      }
    }
    
    console.log('🎉 Migration terminée !');
    
    // Fermer les connexions
    await localConn.close();
    await atlasConn.close();
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

migrateData();