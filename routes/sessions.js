import express from 'express';
import passport from 'passport';
import { register, login, current } from '../controllers/session.controller.js';
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';
import UserDTO from '../dtos/user.dto.js';

const router = express.Router();


// ------------------------------
// Registro y Login
// ------------------------------
router.post('/register', register);
router.post('/login', login);


// ------------------------------
// Ruta /current con DTO
// ------------------------------
router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const dto = new UserDTO(req.user);
        res.json(dto);
    }
);


// ------------------------------
// Recuperación de contraseña
// ------------------------------
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
