const mongoose = require('mongoose');

const ATLAS_URI = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Test de connexion à Atlas...');
    
    await mongoose.connect(ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    
    console.log('✅ Connexion réussie !');
    
    // Test simple
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Collections trouvées:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

testConnection();