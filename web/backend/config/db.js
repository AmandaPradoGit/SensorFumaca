import mysql from "mysql2";

const db = mysql.createConnection({
  host: "172.17.0.3",     
  port: 3306,           
  user: "root",        
  password: "user1232025", 
  database: "SensorFumaca"    
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