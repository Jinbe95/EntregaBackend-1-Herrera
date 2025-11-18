//------------------------------
//carga las variables del .env
//------------------------------

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from './config/passport.js';
import sessionRouter from './routes/sessions.js';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';



const app = express();
const PORT = Number(process.env.PORT) || 8080;
const MONGO_URI = process.env.MONGO_URI;

//------------------------------
//middlewares de seguridad y utilidades
//------------------------------


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //habilita cookies

//------------------------------
//login en desarrollo
//------------------------------
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//------------------------------
//inicializa passport
//------------------------------
app.use(passport.initialize()); //carga las estrategias definidas en passport.js


//------------------------------
//Rutas
//------------------------------
app.use('/api/sessions', sessionRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

//ruta de health
app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' }));

//Error handler
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({ error: error.message || 'Internal server error' });
});

// //prueba
// const User = require('./models/User.js');
// console.log('Modelo User cargado:', User.modelName);

//------------------------------
//Funcion de arranque async y manejo de signals
//------------------------------

async function startServer() {
    if (!MONGO_URI) {
        console.error('MONGO_URI no esta definido en variables de entorno. Revisa .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB');

        const server = app.listen(PORT, () => {
            console.log(`Servidor escuchando en puerto ${PORT}`);
        });

        //Graceful shutdown
        const shutdown = async () => {
            console.log('Cerrando server y conexion a DB...');
            await mongoose.disconnect();
            server.close(() => {
                console.log('Server cerrado');
                process.exit(0);
            });
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        console.log('Error conectando a MongoDB', error);
        process.exit(1);
    }
}

startServer();

export default app;
