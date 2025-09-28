const mongoose = require('mongoose');

// Test Azure MongoDB connection
const testConnection = async () => {
  try {
    const mongoUri = 'mongodb+srv://walidham75:26K8M21C9sytF1bS@chronaxis.qt5ct2m.mongodb.net/?retryWrites=true&w=majority&appName=chronaxis';
    
    console.log('Testing connection to Azure MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Successfully connected to Azure MongoDB');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'Azure connection test' });
    await testDoc.save();
    console.log('✅ Successfully created test document');
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Successfully deleted test document');
    
    await mongoose.disconnect();
    console.log('✅ Connection test completed successfully');
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
  }
};

testConnection();