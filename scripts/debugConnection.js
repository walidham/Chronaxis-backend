const mongoose = require('mongoose');

async function debugConnection() {
  try {
    // Simuler l'environnement Render
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority';
    
    console.log('🔍 URI utilisée:', mongoUri.replace(/:[^:@]*@/, ':***@'));
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion réussie');
    
    // Lister les bases de données
    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('📋 Bases disponibles:', dbs.databases.map(db => db.name));
    
    // Vérifier la base actuelle
    console.log('🎯 Base actuelle:', mongoose.connection.db.databaseName);
    
    // Lister les collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Compter les utilisateurs
    const userCount = await mongoose.connection.db.collection('users').countDocuments();
    console.log('👥 Nombre d\'utilisateurs:', userCount);
    
    // Lister les utilisateurs
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('📝 Utilisateurs:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role})`);
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

debugConnection();