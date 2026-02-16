"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const Data_source_1 = require("../config/Data-source");
const User_1 = require("../models/User");
class UserRepository {
    constructor() {
        this.repository = Data_source_1.AppDataSource.getRepository(User_1.User);
    }
    async findAll() {
        return this.repository.find({
            order: { id: 'ASC' }
        });
    }
    async findAllWithTrips() {
        return this.repository.find({
            relations: ['trips'],
            order: { id: 'ASC' }
        });
    }
    async findByIdWithTrips(id) {
        return this.repository.findOne({
            where: { id },
            relations: ['trips']
        });
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByEmail(email) {
        return this.repository.findOneBy({ email });
    }
    async createAndSave(data) {
        const user = this.repository.create(data);
        return this.repository.save(user);
    }
    async save(user) {
        return this.repository.save(user);
    }
    async removeUser(user) {
        return this.repository.remove(user);
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map