const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/chronaxis?retryWrites=true&w=majority';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  firstName: String,
  lastName: String,
  isActive: Boolean,
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' }
});

async function checkAndCreateAdmin() {
  try {
    console.log('🔍 Vérification des utilisateurs...');
    
    await mongoose.connect(ATLAS_URI);
    const User = mongoose.model('User', userSchema);
    
    // Lister tous les utilisateurs
    const users = await User.find({});
    console.log('👥 Utilisateurs trouvés:', users.length);
    
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Actif: ${user.isActive}`);
    });
    
    // Chercher un admin
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.log('❌ Aucun admin trouvé, création...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      admin = await User.create({
        email: 'admin@chronaxis.com',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'Chronaxis',
        isActive: true
      });
      
      console.log('✅ Admin créé !');
    } else {
      console.log('✅ Admin trouvé, réinitialisation du mot de passe...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      admin.password = hashedPassword;
      admin.isActive = true;
      await admin.save();
    }
    
    console.log('🔑 Informations de connexion:');
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔐 Mot de passe: admin123`);
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

checkAndCreateAdmin();