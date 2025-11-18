import express from 'express';
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Lista de todos los productos (público)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        return res.json({ status: 'success', payload: products });
    } catch (error) {
        console.error('GET /products error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

// Ver producto por id (publico)
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        return res.json({ status: 'success', payload: product });
    } catch (error) {
        console.error('GET /products/:id error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

// Crear producto (solo admin)
router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    authorize('admin'),
    async (req, res) => {
        try {
            const payload = req.body;
            const product = await Product.create(payload);
            return res.status(201).json({ status: 'success', payload: product });
        } catch (error) {
            console.error('POST /products error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

// Actualizar producto (solo admin)
router.put(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize('admin'),
    async (req, res) => {
        try {
            const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            return res.json({ status: 'success', payload: updated });
        } catch (error) {
            console.error('PUT /products/:id error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

// Eliminar producto (solo admin)
router.delete(
    '/:id',
    passport.authenticate('jwt', { session: false }),
    authorize('admin'),
    async (req, res) => {
        try {
            const removed = await Product.findByIdAndDelete(req.params.id);
            if (!removed) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            return res.json({ status: 'success', message: 'Producto eliminado' });
        } catch (error) {
            console.error('DELETE /products/:id error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

export default router;
