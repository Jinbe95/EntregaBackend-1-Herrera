import express from 'express';
import { register, login, current } from '../controllers/session.controller.js';
import passport from 'passport';
import { authorize } from '../middleware/auth.js';

const router = express.Router();


// Registro y login usando controllers
router.post('/register', register);
router.post('/login', login);

// Ruta current protegida por JWT
router.get('/current', passport.authenticate('jwt', { session: false }), current);

// Ruta admin opcional (solo admin)
router.get(
    '/admin',
    passport.authenticate('jwt', { session: false }),
    authorize('admin'),
    (req, res) => {
        res.send('Bienvenido administrador');
    }
);

export default router;