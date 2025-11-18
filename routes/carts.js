import express from 'express';
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const router = express.Router();

// Ver carrito del usuario (user)
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    async (req, res) => {
        try {
            const userId = req.user && (req.user.id || req.user._id);
            if (!userId) return res.status(401).json({ status: 'error', message: 'No autenticado' });

            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            return res.json({ status: 'success', payload: cart || { items: [] } });
        } catch (error) {
            console.error('GET /carts error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

// Agregar producto al carrito (user)
router.post(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    async (req, res) => {
        try {
            const userId = req.user && (req.user.id || req.user._id);
            if (!userId) return res.status(401).json({ status: 'error', message: 'No autenticado' });

            const { productId } = req.params;
            const { quantity = 1 } = req.body;

            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            if (product.stock < quantity) return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });

            let cart = await Cart.findOne({ user: userId });
            if (!cart) cart = await Cart.create({ user: userId, items: [] });

            const idx = cart.items.findIndex(i => String(i.product) === String(productId));
            if (idx > -1) {
                cart.items[idx].quantity += Number(quantity);
            } else {
                cart.items.push({ product: productId, quantity: Number(quantity) });
            }

            await cart.save();
            return res.json({ status: 'success', payload: cart });
        } catch (error) {
            console.error('POST /carts/:productId error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

// Eliminar item del carrito (user)
router.delete(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    authorize('user'),
    async (req, res) => {
        try {
            const userId = req.user && (req.user.id || req.user._id);
            const { productId } = req.params;
            let cart = await Cart.findOne({ user: userId });
            if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

            cart.items = cart.items.filter(i => String(i.product) !== String(productId));
            await cart.save();
            return res.json({ status: 'success', payload: cart });
        } catch (error) {
            console.error('DELETE /carts/:productId error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

export default router;
