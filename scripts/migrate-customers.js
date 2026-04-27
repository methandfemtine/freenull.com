const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

// Your customer data from the plain text file
const customerData = [
  {
    username: 'TotalyNotARatClient',
    userId: 'usr_2d83862b-674b-43e8-9af6-d35008e3f8b4',
    modName: 'BlueLovesBlues',
    expiryDate: '08/08/2999',
    secret: 'throwawaytheirsouls'
  },
  {
    username: 'iamafaggot',
    userId: 'usr_75a65df3-1d9c-475a-8d7e-55ef096493fb',
    modName: 'DuncanParSky66',
    expiryDate: '05/17/2026',
    secret: 'duncanparsky'
  },
  {
    username: 'ilikebigoldmen',
    userId: 'usrid',
    modName: 'snірerz',
    expiryDate: '08/08/2999',
    secret: 'hotpinkvirus'
  }
];

const db = new Database(path.join(process.cwd(), 'data', 'modsite.db'));

// Add expires_at column if it doesn't exist
try {
  const checkColumn = db.prepare("PRAGMA table_info(keys)").all();
  const hasExpiresAt = checkColumn.some((col) => col.name === 'expires_at');

  if (!hasExpiresAt) {
    db.exec('ALTER TABLE keys ADD COLUMN expires_at TEXT');
    console.log('✓ Added expires_at column\n');
  }
} catch (e) {
  // Column already exists
}

console.log('🔄 Migrating customer data to secure database...\n');

let migrated = 0;
let errors = 0;

for (const customer of customerData) {
  try {
    // Generate a new secure key (UUID format)
    const newKey = crypto.randomUUID();

    // Parse expiry date (MM/DD/YYYY)
    const [month, day, year] = customer.expiryDate.split('/');
    const expiryDate = new Date(year, month - 1, day);
    const expiryISO = expiryDate.toISOString();

    // Create label with all old info for reference
    const label = `${customer.username} (old_id: ${customer.userId}) [${customer.modName}]`;

    // Insert into database
    const stmt = db.prepare(
      'INSERT INTO keys (key, label, expires_at, is_active) VALUES (?, ?, ?, 1)'
    );
    stmt.run(newKey, label, expiryISO);

    console.log(`✅ ${customer.username}`);
    console.log(`   Key: ${newKey}`);
    console.log(`   Expires: ${expiryDate.toLocaleDateString()}`);
    console.log();

    migrated++;
  } catch (error) {
    console.error(`❌ Failed to migrate ${customer.username}: ${error.message}`);
    errors++;
  }
}

console.log(`\n✅ Migration complete!`);
console.log(`   Migrated: ${migrated}`);
console.log(`   Errors: ${errors}`);
console.log(`\n⚠️  IMPORTANT:`);
console.log(`   1. Delete the old plain text file PERMANENTLY`);
console.log(`   2. Send customers their new keys via Discord`);
console.log(`   3. New keys are in the admin dashboard`);

db.close();
