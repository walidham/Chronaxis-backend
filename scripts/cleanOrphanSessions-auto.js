const mongoose = require('mongoose');
const Session = require('../models/Session');
const Class = require('../models/Class');
require('dotenv').config();

const cleanOrphanSessionsAuto = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB établie');

    // Supprimer les séances sans classe
    const result1 = await Session.deleteMany({ 
      $or: [
        { class: null },
        { class: { $exists: false } }
      ]
    });

    console.log(`🗑️  ${result1.deletedCount} séances sans classe supprimées`);

    // Récupérer toutes les classes existantes
    const existingClasses = await Class.find({}, '_id');
    const existingClassIds = existingClasses.map(c => c._id.toString());

    // Récupérer les séances avec des classes qui n'existent plus
    const sessionsWithInvalidClass = await Session.find({
      class: { $exists: true, $ne: null }
    });

    const orphanSessionIds = [];
    for (const session of sessionsWithInvalidClass) {
      if (!existingClassIds.includes(session.class.toString())) {
        orphanSessionIds.push(session._id);
      }
    }

    // Supprimer les séances avec des classes inexistantes
    if (orphanSessionIds.length > 0) {
      const result2 = await Session.deleteMany({ _id: { $in: orphanSessionIds } });
      console.log(`🗑️  ${result2.deletedCount} séances avec classes inexistantes supprimées`);
    }

    const totalDeleted = result1.deletedCount + (orphanSessionIds.length || 0);
    console.log(`✅ Nettoyage terminé: ${totalDeleted} séances orphelines supprimées au total`);

    mongoose.connection.close();
    console.log('🔌 Connexion fermée');

  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.connection.close();
  }
};

// Exécuter le script
cleanOrphanSessionsAuto();