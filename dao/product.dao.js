import Product from '../models/Product.js';

export default class ProductDAO {
    async getAll() {
        return Product.find();
    }

    async getById(id) {
        return Product.findById(id);
    }

    async create(data) {
        return Product.create(data);
    }

    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}
