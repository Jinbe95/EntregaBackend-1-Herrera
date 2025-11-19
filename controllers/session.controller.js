import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/user.repository.js'; // Repository que trabaja con DAO
import { createHash, isValidPassword } from '../utils/hash.js';
import { toUserDTO } from '../dtos/user.dto.js';
import { sendMail } from '../utils/mailer.js'; // mover mail a utils

const userRepo = new UserRepository();

// -----------------------------
// Registrar usuario
// -----------------------------
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email y password son obligatorios' });
        }

        const existingUser = await userRepo.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });
        }

        const hashedPassword = createHash(password);

        const newUser = await userRepo.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        const userDTO = toUserDTO(newUser);

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado con éxito',
            payload: userDTO
        });
    } catch (error) {
        console.error('register error', error);
        return res.status(500).json({ status: 'error', message: 'Error en el registro', error: error.message });
    }
};

// -----------------------------
// Login de usuario
// -----------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email y password son obligatorios' });
        }

        const user = await userRepo.getByEmail(email);
        if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

        if (!isValidPassword(password, user.password)) {
            return res.status(401).json({ status: 'error', message: 'Password incorrecto' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        const userDTO = toUserDTO(user);

        return res.json({
            status: 'success',
            message: 'Login exitoso',
            payload: { token, user: userDTO }
        });
    } catch (error) {
        console.error('login error', error);
        return res.status(500).json({ status: 'error', message: 'Error en el login', error: error.message });
    }
};

// -----------------------------
// Current user (requiere JWT)
// -----------------------------
export const current = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'Usuario no autenticado' });
        }

        const userDTO = toUserDTO(user);
        return res.json({ status: 'success', payload: userDTO });
    } catch (error) {
        console.error('current error', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// -----------------------------
// Forgot password - enviar email con token (expira 1 hora)
// -----------------------------
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ status: 'error', message: 'El email es requerido' });

        const user = await userRepo.getByEmail(email);

        // Responder igual si no existe
        if (!user) {
            return res.status(200).json({
                status: 'success',
                message: 'Si el email existe, recibirá un enlace para restablecer la password'
            });
        }

        // generar token y expiración (1 hora)
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 60 * 60 * 1000; // 1 hora

        user.resetToken = token;
        user.resetExpires = new Date(expires);
        await userRepo.update(user._id, user);

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

        console.log(' Reset URL (para pruebas):', resetUrl);

        const subject = 'Recuperar password';
        const text = `Solicitaste restablecer tu password. Ingresa aqui: ${resetUrl}. El enlace expira en 1 hora.`;
        const html = `
            <p>Solicitaste restablecer tu password.</p>
            <p>Haz click en el siguiente botón para continuar:</p>
            <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2D8CFF;color:#fff;border-radius:6px;text-decoration:none;">Restablecer password</a></p>
            <p>El enlace expirara en 1 hora.</p>
        `;

        //await sendMail({ to: email, subject, text, html });

        return res.status(200).json({
            status: 'success',
            message: 'Si el email existe, recibirá un enlace para restablecer la password'
        });
    } catch (error) {
        console.error('forgotPassword error', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// -----------------------------
// Reset password - validar token y cambiar password
// -----------------------------
export const resetPassword = async (req, res) => {
    try {
        const { token, email, newPassword } = req.body;
        if (!token || !email || !newPassword) {
            return res.status(400).json({ status: 'error', message: 'token, email y newPassword son requeridos' });
        }

        const user = await userRepo.getByToken(email, token);

        if (!user || new Date(user.resetExpires) < new Date()) {
            return res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
        }

        if (isValidPassword(newPassword, user.password)) {
            return res.status(400).json({ status: 'error', message: 'La nueva password no puede ser igual a la anterior' });
        }

        user.password = createHash(newPassword);
        user.resetToken = null;
        user.resetExpires = null;
        await userRepo.update(user._id, user);

        return res.json({ status: 'success', message: 'Password restablecida con éxito' });
    } catch (error) {
        console.error('resetPassword error', error);
        return res.status(500).json({ status: 'error', message: 'Error al cambiar la password' });
    }
};


