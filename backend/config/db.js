import mysql from'mysql2'; 
const db = mysql.createConnection({
  host: "127.0.0.1",     
  port: 3306,           
  user: "root",        
  password: "Root123!",
  database: "sensores"    
});

// Conexao
db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar no MariaDB:", err);
    return;
  }
  console.log("Conectado ao MariaDB!");
});
export default db;


