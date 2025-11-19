import Cart from '../models/Cart.js';
import mongoose from 'mongoose';

export default class CartDAO {
    constructor() {
        this.model = Cart;
    }

    // obtener carrito por userId
    async getByUserId(userId) {
        // userId puede venir como string o ObjectId
        const id = mongoose.Types.ObjectId.isValid(userId) ? userId : userId;
        return this.model.findOne({ user: id }).populate('items.product');
    }

    // crear carrito nuevo
    async create(data) {
        return this.model.create(data);
    }

    // actualizar carrito (recibe id y campos a actualizar)
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).populate('items.product');
    }

    // eliminar carrito
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}
