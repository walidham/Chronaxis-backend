const mongoose = require('mongoose');
const Session = require('../models/Session');
const Class = require('../models/Class');
require('dotenv').config();

const cleanOrphanSessions = async () => {
  try {
    // Connexion à la base de données
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connexion à MongoDB établie');

    // Récupérer toutes les séances
    const sessions = await Session.find({});
    console.log(`📊 ${sessions.length} séances trouvées`);

    let orphanCount = 0;
    const orphanSessions = [];

    // Vérifier chaque séance
    for (const session of sessions) {
      if (!session.class) {
        // Séance sans classe
        orphanSessions.push(session._id);
        orphanCount++;
        console.log(`❌ Séance orpheline trouvée: ${session._id} (pas de classe)`);
      } else {
        // Vérifier si la classe existe encore
        const classExists = await Class.findById(session.class);
        if (!classExists) {
          orphanSessions.push(session._id);
          orphanCount++;
          console.log(`❌ Séance orpheline trouvée: ${session._id} (classe ${session.class} n'existe plus)`);
        }
      }
    }

    if (orphanCount === 0) {
      console.log('✅ Aucune séance orpheline trouvée');
    } else {
      console.log(`\n⚠️  ${orphanCount} séances orphelines détectées`);
      console.log('Voulez-vous les supprimer ? (Tapez "oui" pour confirmer)');
      
      // Attendre la confirmation de l'utilisateur
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Confirmation: ', async (answer) => {
        if (answer.toLowerCase() === 'oui') {
          // Supprimer les séances orphelines
          const result = await Session.deleteMany({ _id: { $in: orphanSessions } });
          console.log(`✅ ${result.deletedCount} séances orphelines supprimées`);
        } else {
          console.log('❌ Nettoyage annulé');
        }
        
        rl.close();
        mongoose.connection.close();
        console.log('🔌 Connexion fermée');
      });
    }

  } catch (error) {
    console.error('❌ Erreur:', error);
    mongoose.connection.close();
  }
};

// Exécuter le script
cleanOrphanSessions();