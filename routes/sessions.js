import express from 'express';
import passport from 'passport';
import { register, login, current } from '../controllers/session.controller.js';
import { forgotPassword, resetPassword } from '../controllers/session.controller.js';


const router = express.Router();

// ------------------------------
// Registro y Login
// ------------------------------
router.post('/register', register);
router.post('/login', login);

// ------------------------------
// Ruta /current con DTO (solo autenticado)
// ------------------------------
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    current
);

// ------------------------------
// Recuperación de password
// ------------------------------
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
