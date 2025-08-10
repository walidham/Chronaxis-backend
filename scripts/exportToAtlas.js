const { exec } = require('child_process');
const path = require('path');

// Remplacez par votre URL Atlas
const ATLAS_URI = "mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/?retryWrites=true&w=majority&appName=chronaxis";
const LOCAL_DB = "university-schedule";

const collections = [
  'users',
  'departments', 
  'courses',
  'classes',
  'teachers',
  'rooms',
  'sessions',
  'grades',
  'academicyears'
];

async function exportCollection(collection) {
  return new Promise((resolve, reject) => {
    const exportCmd = `mongoexport --db ${LOCAL_DB} --collection ${collection} --out ${collection}.json`;
    
    exec(exportCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur export ${collection}:`, error);
        reject(error);
        return;
      }
      console.log(`✅ ${collection} exporté`);
      resolve();
    });
  });
}

async function importCollection(collection) {
  return new Promise((resolve, reject) => {
    const importCmd = `mongoimport --uri "${ATLAS_URI}" --collection ${collection} --file ${collection}.json --drop`;
    
    exec(importCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erreur import ${collection}:`, error);
        reject(error);
        return;
      }
      console.log(`✅ ${collection} importé vers Atlas`);
      resolve();
    });
  });
}

async function migrateToAtlas() {
  console.log('🚀 Début de la migration vers Atlas...');
  
  try {
    // Export toutes les collections
    for (const collection of collections) {
      await exportCollection(collection);
    }
    
    console.log('📤 Export terminé, début de l\'import...');
    
    // Import vers Atlas
    for (const collection of collections) {
      await importCollection(collection);
    }
    
    console.log('🎉 Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  }
}

migrateToAtlas();