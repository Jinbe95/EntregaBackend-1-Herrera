//carga las variables del .env
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import sessionRouter from './routes/sessions.js';


const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI;


//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //habilita cookies
app.use(passport.initialize()); //carga las estrategias definidas en passport.js

//Rutas
app.use('/', sessionRouter);


// //prueba
// const User = require('./models/User.js');
// console.log('Modelo User cargado:', User.modelName);

//Conectar a MongoDB y arrancar server
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
    })
    .catch(error => console.error('Error conectando a MongoDB:', error));