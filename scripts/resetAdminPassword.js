const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Configuration Atlas
const ATLAS_URI = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority';

// Schéma User simplifié
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  firstName: String,
  lastName: String,
  isActive: Boolean,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

async function resetAdminPassword() {
  try {
    console.log('🔐 Réinitialisation du mot de passe admin...');
    
    // Connexion à Atlas
    await mongoose.connect(ATLAS_URI);
    const User = mongoose.model('User', userSchema);
    
    // Nouveau mot de passe
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Trouver et mettre à jour l'admin
    const admin = await User.findOneAndUpdate(
      { role: 'admin' },
      { 
        password: hashedPassword,
        isActive: true 
      },
      { new: true }
    );
    
    if (admin) {
      console.log('✅ Mot de passe admin réinitialisé !');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 Nouveau mot de passe: ${newPassword}`);
    } else {
      console.log('❌ Aucun admin trouvé');
    }
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

resetAdminPassword();