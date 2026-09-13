// Register 
// Login 

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.js')

// Register endpoint 

async function registerUser(req,res) {
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message: "No todos los datos proporcionados"})
        }
        if(password.length < 6){
            return res.status(400).json({message: "Contraseña no cumple"})
        }
        const[existing] = await pool.query('SELECT id FROM users WHERE email=?',[email]);
        
        if(existing.length > 0){
            return res.status(400).json({message: "Email ya existe"})
        }

        // Encriptar 
        const hashedPassword = await bcrypt.hash(password,10);
        const [result] = await pool.query('INSERT INTO users (name,email,password) VALUES (?),(?),(?)',
                                        [name,email,hashedPassword]
        );

        // Create Token (7 dias)
        const token = jwt.sign({id: result.insertId, email}, 
                                process.env.JWT_SECRET,
                                {expiresIn: "7d"}
        );
        // Responder usuario registrado con exito 
        res.status(201).json({message:"Registrado con exito",token,user:{id:result.insertId},name,email})
    } catch (error) {
        console.error("error en el registro del usuario", error)
        res.status(500).json({message: "Error interno del servidor"})
    }
}

async function loginUser(req,res) {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "No todos los datos proporcionados"})
        }

        // buscar user por email 

        const[users]= await pool.query("SELECT * FROM users WHERE email = (?)",[email]);
        if(users.length === 0){
            return res.status(401).json({message: "Credenciales incorrectas"});
        }
        const user = users[0];

        //Comparar contraseña 

        const isValid = await bcrypt.compare(password,user.password); // contraseña en la db 
        if(!isValid){
            return res.status(401).json({message: "Credenciales incorrectas"});
        }

        

        const token = jwt.sign({id: user.id , email: user.email}, 
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )
    return res.status(200).json({message: "Inicio de session exitoso",token,user:{id:user.id, name: user.name, email:user.email}})

    }catch (error){
        console.error("Error en el servidor al inciar session",error)

        return res.status(500).json({message:"Error en el servidor"});
    }
}

module.exports = {registerUser,loginUser}
