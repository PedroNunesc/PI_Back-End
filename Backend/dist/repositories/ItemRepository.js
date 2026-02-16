"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemRepository = void 0;
const Data_source_1 = require("../config/Data-source");
const Item_1 = require("../models/Item");
class ItemRepository {
    constructor() {
        this.repository = Data_source_1.AppDataSource.getRepository(Item_1.Item);
    }
    async findAllWithUser() {
        return this.repository.find({
            relations: ["user"],
            order: { id: "ASC" },
        });
    }
    async findByIdWithUser(id) {
        return this.repository.findOne({
            where: { id },
            relations: ["user", "trip"],
        });
    }
    async findById(id) {
        return this.repository.findOneBy({ id });
    }
    async findByTripId(tripId) {
        return this.repository.find({
            where: { trip: { id: tripId } },
            relations: ["user", "trip"],
            order: { name: "ASC" },
        });
    }
    async createAndSave(data) {
        const item = this.repository.create(data);
        return this.repository.save(item);
    }
    async save(item) {
        return this.repository.save(item);
    }
    async removeItem(item) {
        return this.repository.remove(item);
    }
}
exports.ItemRepository = ItemRepository;
//# sourceMappingURL=ItemRepository.js.map