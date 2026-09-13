// Here llamamos la base de datos

const mysql = require(mysql2 / promise);
require('dotenv').config // env files 

// Pull de conexiones 
const pool = mysql.createPool({
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'root',
    // pass no password 
    pass : process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'ecommerceflutterg1',
    waitForConnections: true, // wait for connect to db
    connectionLimit: 10, // max conexiones simultaneas
});

module.exports = pool // exportamos pool para que se use en otro archivo 