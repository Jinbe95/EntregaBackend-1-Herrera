import express from 'express';
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';

const router = express.Router();
const cartRepo = new CartRepository();
const productRepo = new ProductRepository();

// Ver carrito
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize('user', 'admin'),
    async (req, res) => {
        const userId = req.user?.id || req.user?._id;
        const cart = await cartRepo.getByUserId(userId);
        return res.json({ status: 'success', payload: cart || { items: [] } });
    }
);

// Agregar producto
router.post(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    authorize('user', 'admin'),
    async (req, res) => {
        const userId = req.user?.id || req.user?._id;
        const { productId } = req.params;
        const { quantity = 1 } = req.body;

        // validar producto y stock si querés
        const product = await productRepo.getById(productId);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        if (product.stock < quantity) return res.status(400).json({ status: 'error', message: 'Stock insuficiente' });

        const cart = await cartRepo.addProduct(userId, productId, quantity);
        return res.json({ status: 'success', payload: cart });
    }
);

// Eliminar producto
router.delete(
    '/:productId',
    passport.authenticate('jwt', { session: false }),
    authorize('user', 'admin'),
    async (req, res) => {
        const userId = req.user?.id || req.user?._id;
        const { productId } = req.params;

        const cart = await cartRepo.removeProduct(userId, productId);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        return res.json({ status: 'success', payload: cart });
    }
);

export default router;