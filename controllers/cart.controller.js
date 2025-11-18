import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

//Agregar producto al carrito (solo user)

export const addToCartHandler = async (req, res) => {
    try {
        const userId = req.user && (req.user.id || req.user._id);
        if (!userId) return res.status(401).json({ status: 'error', message: 'Usuario no autenticado ' })

        const { productId } = req.params;
        const { quantity = 1 } = req.body;

        //Verificar que el producto exista
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        if (product.stock < quantity) return res.status(400).json({ status: 'error', message: 'Stock insuficiente' })



        // buscar o crear carrito
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [] });
        }

        // chequear si el item ya existe
        const idx = cart.items.findIndex(i => String(i.product) === String(productId));
        if (idx > -1) {
            cart.items[idx].quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.save();

        return res.json({ status: 'success', payload: cart });
    } catch (error) {
        console.error('addToCart error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
};