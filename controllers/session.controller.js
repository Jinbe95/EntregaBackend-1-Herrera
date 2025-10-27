import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { createHash, isValidPassword } from '../utils/hash.js';

// -----------------------------
// Registrar usuario
// -----------------------------
export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        //verificamos si ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'El usuario ya existe' });

        //hasheamos la password
        const hashedPassword = createHash(password);

        const newUser = await User.create({
            first_name,
            last_name,
            email,
            age,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
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
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        if (!isValidPassword(password, user.password))
            return res.status(401).json({ message: 'Password incorrecto' });

        // Crear token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Guardar token en cookie
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 });
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error: error.message });
    }
};


// -----------------------------
// Obtener usuario actual (desde token)
// -----------------------------
export const current = async (req, res) => {
    res.json({ user: req.user });
};
