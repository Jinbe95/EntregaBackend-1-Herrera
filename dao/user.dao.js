import User from '../models/User.js';

export default class UserDAO {
    constructor() {
        this.model = User;
    }

    // Buscar usuario por email
    async getByEmail(email) {
        return this.model.findOne({ email });
    }

    // Buscar usuario por id
    async getById(id) {
        return this.model.findById(id);
    }

    // Crear usuario
    async create(data) {
        return this.model.create(data);
    }

    // Actualizar usuario
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true });
    }


    async getByToken(email, token) {
        return await this.model.findOne({ email, resetToken: token });
    }

}
