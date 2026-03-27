const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Expect service account key path in GOOGLE_APPLICATION_CREDENTIALS
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!serviceAccountPath) {
  console.error('Please set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON path');
  process.exit(1);
}

const serviceAccount = require(path.resolve(serviceAccountPath));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const seedPath = path.join(__dirname, 'recruitmentSeed.json');
if (!fs.existsSync(seedPath)) {
  console.error('Seed file not found:', seedPath);
  process.exit(1);
}

const jobs = require(seedPath);

(async () => {
  try {
    for (const job of jobs) {
      const docId = String(job.id);
      await db.collection('recruitment').doc(docId).set(job, { merge: true });
      console.log('Wrote document recruitment/' + docId);
    }
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
})();
