require('dotenv').config();
const mongoose = require('mongoose');
const Track = require('../models/Track');
const Department = require('../models/Department');

const createTracks = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI non définie dans .env');
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const departments = await Department.find();
    
    const tracksByDept = {
      'Technologies de l\'Informatique': [
        { name: 'Tronc Commun', code: 'TC' },
        { name: 'Développement des Systèmes d\'Information', code: 'DSI' },
        { name: 'Réseaux et Services Informatiques', code: 'RSI' },
        { name: 'Multimédia et Développement Web', code: 'MDW' }
      ],
      'Génie Électrique': [
        { name: 'Tronc Commun', code: 'TC' },
        { name: 'Maintenance des Équipements Industriels', code: 'MEI' },
        { name: 'Électronique Industrielle', code: 'EI' }
      ],
      'Génie Mécanique': [
        { name: 'Tronc Commun', code: 'TC' },
        { name: 'Conception et Fabrication mécanique', code: 'CFM' },
        { name: 'Construction Métallique', code: 'CM' }
      ],
      'Sciences Economiques et de Gestion': [
        { name: 'Tronc Commun', code: 'TC' },
        { name: 'Administration des Affaires', code: 'AA' },
      ]
    };

    for (const dept of departments) {
      const tracks = tracksByDept[dept.name] || [
        { name: 'Tronc Commun', code: 'TC' }
      ];
      
      for (const trackData of tracks) {
        const existingTrack = await Track.findOne({ 
          code: trackData.code, 
          department: dept._id 
        });
        
        if (!existingTrack) {
          await Track.create({
            name: trackData.name,
            code: trackData.code,
            department: dept._id
          });
          console.log(`Filière créée: ${trackData.name} (${trackData.code}) - ${dept.name}`);
        }
      }
    }

    console.log('Filières créées avec succès');
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    mongoose.connection.close();
  }
};

createTracks();