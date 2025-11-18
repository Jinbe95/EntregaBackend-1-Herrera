import Product from '../models/Product.js';

//----------------------------
//Solo Admin
//----------------------------

//Crear producto
export const createProductHandler = async (req, res) => {
    try {
        const payload = req.body;
        const product = await Product.create(payload);
        return res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        console.error('createProduct error', error);
        return res.status(500).json({ status: 'error', message: error.message })
    }
};

//Actualizar producto
export const updateProductHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        return res.json({ status: 'success', payload: updated });
    } catch (error) {
        console.error('updateProduct error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};


//Eliminar producto
export const deleteProductHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Product.findByIdAndDelete(id);
        if (!removed) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        return res.json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
        console.error('deleteProduct error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};




//----------------------------
// Lista productos (Publico)
//----------------------------

export const listProductsHandler = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json({ status: 'success', payload: products });
    } catch (error) {
        console.error('listProducts error', error);
        return res.status(500).json({ status: 'error', message: error.message })
    }
};

// Obtener producto por ID
export const getProductByIdHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' })
        return res.status(200).json({ status: 'success', payload: product });
    } catch (error) {
        console.error('getProductById error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};