const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connecté');
    
    try {
      const db = mongoose.connection.db;
      const sessionsCollection = db.collection('sessions');
      
      await sessionsCollection.dropIndex('class_1_dayOfWeek_1_timeSlot_1_semester_1');
      console.log('Index supprimé avec succès');
    } catch (error) {
      console.error('Erreur:', error.message);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Erreur de connexion:', err);
  });