import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from '../utils/hash.js';
import { toUserDTO } from '../dtos/user.dto.js';

// -----------------------------
// Registrar usuario
// -----------------------------
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son obligatorios' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const hashedPassword = createHash(password);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        const userDTO = toUserDTO(newUser);

        res.status(201).json({
            message: 'Usuario registrado con exito',
            user: userDTO
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error: error.message });
    }
};

// -----------------------------
// Login de usuario
// -----------------------------
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y password son obligatorios' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (!isValidPassword(password, user.password)) {
            return res.status(401).json({ message: 'Password incorrecto' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        const userDTO = toUserDTO(user);

        res.json({
            message: 'Login exitoso',
            token,
            user: userDTO
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};

// -----------------------------
// Current user (requiere JWT)
// -----------------------------
export const current = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Usuario no autenticado'
            });
        }

        const userDTO = toUserDTO(user);

        res.json({
            status: 'success',
            payload: userDTO
        });

    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
};
