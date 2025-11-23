const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    // Connect without specifying database
    // Try without password first (common for fresh MySQL installs)
    let connection;
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            multipleStatements: true
        });
        console.log('✓ Connected (no password)');
    } catch (err) {
        // Try with password admin123
        connection = await mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'admin123',
            multipleStatements: true
        });
        console.log('✓ Connected (with password)');
    }

    try {
        console.log('Creating database...');
        await connection.execute('CREATE DATABASE IF NOT EXISTS resolutepos_db');
        console.log('✓ Database created/verified');

        console.log('Switching to resolutepos_db...');
        await connection.execute('USE resolutepos_db');

        console.log('Importing schema...');
        const sqlFile = fs.readFileSync(path.join(__dirname, 'resolutepos_db.sql'), 'utf8');
        await connection.query(sqlFile);
        console.log('✓ Schema imported');

        console.log('\n✅ Database setup complete!');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

setupDatabase();
