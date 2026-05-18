// server/db/seed.js
// Run once: node server/db/seed.js
// Creates the users table and inserts all 5 users with hashed passwords.

const { Pool } = require('pg');
const bcrypt   = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.PG_URI,
  ssl: { rejectUnauthorized: false },
});

const USERS = [
  { id: 'EMP101',  password: 'emp123',   role: 'Employee', name: 'Piyush',         label: 'Employee Environment',   icon: '💼' },
  { id: 'EMP102',  password: 'emp234',   role: 'Employee', name: 'Surya',          label: 'Employee Environment',   icon: '💼' },
  { id: 'EMP103',  password: 'emp345',   role: 'Employee', name: 'Ravit',          label: 'Employee Environment',   icon: '💼' },
  { id: 'MGR555',  password: 'mgr123',   role: 'Manager',  name: 'Sarah Mitchell', label: 'Executive L1 Dashboard', icon: '🛡️' },
  { id: 'ADMIN01', password: 'admin123', role: 'Admin',    name: 'System Admin',   label: 'System Administrator',   icon: '⚙️' },
];

async function seed() {
  try {
    // Create table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            VARCHAR(20)  PRIMARY KEY,
        password_hash TEXT         NOT NULL,
        role          VARCHAR(20)  NOT NULL,
        name          VARCHAR(100) NOT NULL,
        label         VARCHAR(100) NOT NULL,
        icon          VARCHAR(10)  NOT NULL,
        created_at    TIMESTAMPTZ  DEFAULT NOW()
      );
    `);
    console.log('✅ users table ready');

    // Insert users
    for (const u of USERS) {
      const hash = await bcrypt.hash(u.password, 12);
      await pool.query(
        `INSERT INTO users (id, password_hash, role, name, label, icon)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [u.id, hash, u.role, u.name, u.label, u.icon]
      );
      console.log(`✅ Inserted: ${u.id} (${u.role})`);
    }

    console.log('\n🎉 Seed complete! All users inserted.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
