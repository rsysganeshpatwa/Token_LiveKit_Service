import mongoose from 'mongoose';

const cleanupMongo = async () => {
  try {
    const db = mongoose.connection.db;

    // Drop bad index if it exists
    const indexes = await db.collection('rooms').indexes();
    const badIndex = indexes.find(i => i.name === 'participants.identity_1');

    if (badIndex) {
      console.log('⚠️ Found old index "participants.identity_1" — removing...');
      await db.collection('rooms').dropIndex('participants.identity_1');
      console.log('✅ Dropped bad index.');
    } else {
      console.log('✅ No bad index found.');
    }

    // Remove all data from rooms and participants collections
    const roomResult = await db.collection('rooms').deleteMany({});
    const participantResult = await db.collection('participants').deleteMany({});

    console.log(`🗑️ Cleared ${roomResult.deletedCount} rooms and ${participantResult.deletedCount} participants.`);

  } catch (err) {
    console.error('❌ Cleanup error:', err);
  }
};

export default cleanupMongo;
