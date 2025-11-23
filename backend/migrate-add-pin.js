const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    try {
        console.log('Checking if PIN column exists...');
        const [columns] = await connection.execute(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'resolutepos_db' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'pin'"
        );

        if (columns.length === 0) {
            console.log('Adding PIN column to users table...');
            await connection.execute('ALTER TABLE users ADD COLUMN pin VARCHAR(6) DEFAULT NULL');
            console.log('✓ PIN column added');
        } else {
            console.log('✓ PIN column already exists');
        }

        console.log('\nUpdating test users with PINs...');
        await connection.execute("UPDATE users SET pin = '1234' WHERE username = 'admin'");
        await connection.execute("UPDATE users SET pin = '5678' WHERE username = 'sam12'");
        await connection.execute("UPDATE users SET pin = '9999' WHERE username = 'will24'");
        await connection.execute("UPDATE users SET pin = '1111' WHERE username = 'renny99'");
        await connection.execute("UPDATE users SET pin = '2222' WHERE username = 'rina24'");
        await connection.execute("UPDATE users SET pin = '3333' WHERE username = 'nancy20'");
        console.log('✓ Test users updated');

        console.log('\nTest PINs:');
        console.log('  admin: 1234');
        console.log('  sam12: 5678');
        console.log('  will24: 9999');
        console.log('  renny99: 1111');
        console.log('  rina24: 2222');
        console.log('  nancy20: 3333');

        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

migrate();
