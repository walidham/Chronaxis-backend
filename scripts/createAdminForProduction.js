const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// URL Atlas utilisée par Render
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

async function createAdminForProduction() {
  try {
    console.log('🚀 Création admin pour production...');
    
    await mongoose.connect(ATLAS_URI);
    const User = mongoose.model('User', userSchema);
    
    // Vérifier si admin existe
    let admin = await User.findOne({ email: 'admin@iset.tn' });
    
    if (admin) {
      console.log('✅ Admin existe déjà, mise à jour...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      admin.password = hashedPassword;
      admin.isActive = true;
      await admin.save();
    } else {
      console.log('➕ Création nouvel admin...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      admin = await User.create({
        email: 'admin@iset.tn',
        password: hashedPassword,
        role: 'admin',
        firstName: 'Admin',
        lastName: 'ISET',
        isActive: true
      });
    }
    
    console.log('✅ Admin configuré pour production !');
    console.log('📧 Email: admin@iset.tn');
    console.log('🔐 Mot de passe: admin123');
    
    // Vérifier tous les utilisateurs
    const allUsers = await User.find({});
    console.log(`👥 Total utilisateurs: ${allUsers.length}`);
    allUsers.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - Actif: ${user.isActive}`);
    });
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

createAdminForProduction();