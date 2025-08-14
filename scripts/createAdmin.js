require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const createAdmin = async () => {
  try {
    // Connexion à MongoDB
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI non définie dans .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    // Vérifier si un admin existe déjà
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Un administrateur existe déjà:', existingAdmin.email);
      process.exit(0);
    }

    // Créer l'admin par défaut
    const admin = new User({
      email: 'admin@iset.tn',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'ISET',
      role: 'admin',
      isActive: true
    });

    await admin.save();
    console.log('Administrateur créé avec succès:');
    console.log('Email: admin@iset.tn');
    console.log('Mot de passe: admin123');
    console.log('IMPORTANT: Changez le mot de passe après la première connexion!');

  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();