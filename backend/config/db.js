import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sensorfumaca',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connection established successfully.');
    connection.release();
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

testConnection();
export default pool;