import ProductDAO from '../dao/product.dao.js';

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDAO();
    }

    async getAll() {
        return this.dao.getAll();
    }

    async getById(id) {
        return this.dao.getById(id);
    }

    async create(productData) {
        return this.dao.create(productData);
    }

    async update(id, updateData) {
        return this.dao.update(id, updateData);
    }

    async delete(id) {
        return this.dao.delete(id);
    }
}
