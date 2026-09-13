const pool = require('../config/db.js')

async function getCategories(req,res) {
    
    try {
        const[categories] = await pool.query('SELECT * FROM categories ORDER BY name')     // check name on db 
        res.json(categories)

    } catch (error) {
        console.error("Error al traer categorias", error);
        return res.status(500).json({message: "Error en el servidor"})
    }
}


module.exports = {getCategories}