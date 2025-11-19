import express from 'express';
import passport from 'passport';
import { authorize } from '../middleware/auth.js';
import ProductRepository from '../repositories/product.repository.js';

const router = express.Router();
const productRepo = new ProductRepository();

// Lista de todos los productos (público)
router.get('/', async (req, res) => {
    try {
        const products = await productRepo.getAll();
        return res.json({ status: 'success', payload: products });
    } catch (error) {
        console.error('GET /products error', error);
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

// Ver producto por id (público)
router.get('/:id', async (req, res) => {
    try {
        const product = await productRepo.getById(req.params.id);
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
            const product = await productRepo.create(payload);
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
            const updated = await productRepo.update(req.params.id, req.body);
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
            const removed = await productRepo.delete(req.params.id);
            if (!removed) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
            return res.json({ status: 'success', message: 'Producto eliminado' });
        } catch (error) {
            console.error('DELETE /products/:id error', error);
            return res.status(500).json({ status: 'error', message: error.message });
        }
    }
);

export default router;
