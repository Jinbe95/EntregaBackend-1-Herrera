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
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true // guardamos el hash
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts', // referencia al modelo Cart
        default: null
    },
    role: {
        type: String,
        default: 'user'
    }
}, { timestamps: true }); // timestamps correcto

// Exportamos el modelo
const User = mongoose.model('User', userSchema);
export default User;