"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripRepository = void 0;
const Data_source_1 = require("../config/Data-source");
const Trip_1 = require("../models/Trip");
class TripRepository {
    constructor() {
        this.repository = Data_source_1.AppDataSource.getRepository(Trip_1.Trip);
    }
    async findAllWithUser() {
        return this.repository.find({
            relations: ["user"],
            order: { id: "ASC" }
        });
    }
    async findByIdWithUser(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["user"]
        });
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["user"]
        });
    }
    async findByUserId(userId) {
        return this.repository.find({
            where: { user: { id: userId } },
            relations: ["user"],
            order: { startDate: "ASC" }
        });
    }
    async createAndSave(data) {
        const trip = this.repository.create(data);
        return this.repository.save(trip);
    }
    async save(trip) {
        return this.repository.save(trip);
    }
    async removeTrip(trip) {
        return this.repository.remove(trip);
    }
}
exports.TripRepository = TripRepository;
//# sourceMappingURL=TripRepository.js.map