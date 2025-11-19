// repositories/user.repository.js
import UserDAO from '../dao/user.dao.js';

export default class UserRepository {
    constructor() {
        this.dao = new UserDAO();
    }

    // Listar todos
    async getAll() {
        return this.dao.getAll();
    }

    // Obtener por id
    async getById(userId) {
        return this.dao.getById(userId);
    }

    // Obtener por email
    async getByEmail(email) {
        return this.dao.getByEmail(email);
    }

    // Crear (nombre corto)
    async create(userData) {
        return this.dao.create(userData);
    }

    // Alias para compatibilidad (si alguna parte del código llama a createUser)
    async createUser(userData) {
        return this.create(userData);
    }

    // Actualizar (nombre corto)
    async update(id, data) {
        return this.dao.update(id, data);
    }

    // Alias para compatibilidad
    async updateUser(userId, updateData) {
        return this.update(userId, updateData);
    }

    // Eliminar
    async delete(id) {
        return this.dao.delete(id);
    }

    // Alias para compatibilidad
    async deleteUser(userId) {
        return this.delete(userId);
    }

    async getByToken(email, token) {
        return await this.dao.getByToken(email, token);
    }


    // Para password reset (usa update internamente)
    async setResetToken(userId, token, expires) {
        return this.update(userId, {
            resetToken: token,
            resetExpires: expires
        });
    }

    async clearResetToken(userId) {
        return this.update(userId, {
            resetToken: null,
            resetExpires: null
        });
    }
}
