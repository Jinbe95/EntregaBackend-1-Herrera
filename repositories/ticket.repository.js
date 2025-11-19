import TicketDAO from '../dao/ticket.dao.js';

export default class TicketRepository {
    constructor() {
        this.dao = new TicketDAO();
    }

    async createTicket(data) {
        return await this.dao.create(data);
    }

    async getTicketById(id) {
        return await this.dao.getById(id);
    }

    async getTicketByCode(code) {
        return await this.dao.getByCode(code);
    }

    async getAllTickets() {
        return await this.dao.getAll();
    }
}
