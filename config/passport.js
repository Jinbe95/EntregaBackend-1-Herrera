import dotenv from 'dotenv';
dotenv.config();

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';
import { isValidPassword } from '../utils/hash.js';

// ----------------------------
// Extractor de cookie
//-----------------------------
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) token = req.cookies.jwt;
    return token;
};

// ----------------------------
// Estrategia local para login con usuario y password
//-----------------------------
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) return done(null, false, { message: 'Usuario no encontrado' });
                if (!isValidPassword(password, user.password))
                    return done(null, false, { message: 'Password incorrecta' });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

// ----------------------------
// Estrategia JWT (validación del token)
// Soporta cookies y Authorization header
//-----------------------------
passport.use(
    'jwt',
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(), // header Authorization: Bearer <token>
                cookieExtractor, // cookie 'jwt'
            ]),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwt_payload, done) => {
            try {
                const user = await User.findById(jwt_payload.id);
                if (!user) return done(null, false, { message: 'Token inválido' });
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;
