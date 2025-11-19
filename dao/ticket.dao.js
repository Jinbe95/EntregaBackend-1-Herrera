import Ticket from '../models/Ticket.js';

export default class TicketDAO {
    async create(data) {
        return await Ticket.create(data);
    }

    async getById(id) {
        return await Ticket.findById(id);
    }

    async getByCode(code) {
        return await Ticket.findOne({ code });
    }

    async getAll() {
        return await Ticket.find();
    }
}
