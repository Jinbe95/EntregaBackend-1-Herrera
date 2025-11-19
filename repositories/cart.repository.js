import CartDAO from '../dao/cart.dao.js';

export default class CartRepository {
    constructor() {
        this.dao = new CartDAO();
    }

    // devuelve carrito (o null) con items poblados
    async getByUserId(userId) {
        return this.dao.getByUserId(userId);
    }

    // crea carrito nuevo
    async create(cartData) {
        return this.dao.create(cartData);
    }

    // actualiza carrito por id (data: campos a setear)
    async update(cartId, data) {
        return this.dao.update(cartId, data);
    }

    async delete(cartId) {
        return this.dao.delete(cartId);
    }


    // Agrega producto (si no existe en items lo inserta, si existe suma cantidad)
    async addProduct(userId, productId, quantity = 1) {
        let cart = await this.getByUserId(userId);
        if (!cart) {
            cart = await this.create({ user: userId, items: [{ product: productId, quantity }] });
            return cart;
        }

        const idx = cart.items.findIndex(i => String(i.product) === String(productId));
        if (idx > -1) {
            cart.items[idx].quantity = Number(cart.items[idx].quantity) + Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        return this.update(cart._id, { items: cart.items });
    }

    // Remueve producto del carrito (por productId)
    async removeProduct(userId, productId) {
        const cart = await this.getByUserId(userId);
        if (!cart) return null;
        const newItems = cart.items.filter(i => String(i.product) !== String(productId));
        return this.update(cart._id, { items: newItems });
    }
}
