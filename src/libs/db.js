import mysql from 'mysql2/promise';

// Configura la conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'pidetucancion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export default connection  
