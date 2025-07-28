const mongoose = require('mongoose');
const Grade = require('../models/Grade');
require('dotenv').config();

const grades = [
  { name: 'Professeur Technologue', abbreviation: 'Prof. Tech.', level: 7 },
  { name: 'Maître technologue', abbreviation: 'M. Tech.', level: 6 },
  { name: 'Technologue', abbreviation: 'Tech.', level: 5 },
  { name: 'Docteur', abbreviation: 'Dr.', level: 4 },
  { name: 'Professeur d\'enseignement secondaire', abbreviation: 'Prof. Sec.', level: 3 },
  { name: 'Doctorant', abbreviation: 'Doct.', level: 2 },
  { name: 'Vacataire', abbreviation: 'Vac.', level: 1 }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connecté');
    
    try {
      await Grade.deleteMany({});
      await Grade.insertMany(grades);
      console.log('Grades créés avec succès');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Erreur de connexion:', err);
  });