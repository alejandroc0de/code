const pool = require('../config/db.js')

async function getProducts(req,res) {
    try {
        const [products] = await pool.query(`
            SELECT p.*, c.name AS category_name
            FROM products p 
            JOIN categories c ON p.category.id = c.id 
            ORDER BY p.name`) 
        res.json(products)
    } catch (error) {
        console.error('Error en getProducts', error);
        res.status(500).json({message: 'error interno del servidor'})
    }
    
}

// UN producto por id 

async function getProductById(req,res) {
    try {
        const {id} = req.params; 
        const [products] = await pool.query(`
            SELECT p.*, c.name AS category_name
            FROM products p 
            JOIN categories c ON p.category.id = c.id 
            WHERE p.id = ?
            `,[id])
    res.json(products)
    if(products.lenght === 0){
        return res.status(404).json({message: "Producto no encontrado"})
    }
    } catch (error) {
        console.error('Error en getProductsbyId', error);
        res.status(500).json({message: 'error interno del servidor'})
    }
}

async function getProductByCategory(req,res) {
    try {
        const {categoryId} = req.params; 
        const [products] = await pool.query(`
            SELECT p.*, c.name AS category_name
            FROM products p 
            JOIN categories c ON p.category.id = c.id 
            ORDER BY p.name
            `, [categoryId])
        res.json(products[0])
        
    } catch (error) {
        console.error('Error en getProductsbyCategory', error);
        res.status(500).json({message: 'error interno del servidor'})
    }
}

module.exports = {getProducts, getProductById, getProductByCategory}

//43 