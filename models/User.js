import mongoose from 'mongoose';
const { Schema } = mongoose;

// Definimos la estructura del usuario
const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true // guardamos el hash
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },

    // campos necesarios para recuperación de password
    resetToken: {
        type: String,
        default: null
    },
    resetExpires: {
        type: Date,
        default: null
    }
}, { timestamps: true });

//Exportamos el modelo
const User = mongoose.model('User', userSchema);
export default User;
