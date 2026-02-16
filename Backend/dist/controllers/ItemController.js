"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const ItemRepository_1 = require("../repositories/ItemRepository");
const UserRepository_1 = require("../repositories/UserRepository");
const TripRepository_1 = require("../repositories/TripRepository");
const itemRepository = new ItemRepository_1.ItemRepository();
const userRepository = new UserRepository_1.UserRepository();
const tripRepository = new TripRepository_1.TripRepository();
class ItemController {
    async list(req, res) {
        try {
            const items = await itemRepository.findAllWithUser();
            return res.json(items);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor interno" });
        }
    }
    async show(req, res) {
        try {
            const { id } = req.params;
            const item = await itemRepository.findByIdWithUser(Number(id));
            if (!item) {
                return res.status(404).json({ message: "Item não encontrado" });
            }
            return res.json(item);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Erro no servidor interno" });
        }
    }
    async getByTrip(req, res) {
        try {
            const { tripId } = req.params;
            const items = await itemRepository.findByTripId(Number(tripId));
            return res.json(items);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async create(req, res) {
        try {
            const { name, category, tripId } = req.body;
            const userId = req.user.id;
            if (!name || !category || !tripId) {
                return res.status(400).json({
                    message: "Name, category and tripId are required",
                });
            }
            const user = await userRepository.findById(Number(userId));
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const trip = await tripRepository.findById(Number(tripId));
            if (!trip) {
                return res.status(404).json({ message: "Trip not found" });
            }
            const item = await itemRepository.createAndSave({
                name,
                category,
                user,
                trip,
            });
            return res.status(201).json(item);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const { name, category, tripId, isPacked } = req.body;
            const item = await itemRepository.findByIdWithUser(Number(id));
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            if (req.user.role !== "admin" && item.user?.id !== userId) {
                return res.status(403).json({ message: "Access denied" });
            }
            if (name)
                item.name = name;
            if (category)
                item.category = category;
            if (typeof isPacked === "boolean")
                item.isPacked = isPacked;
            if (tripId) {
                const trip = await tripRepository.findById(Number(tripId));
                if (!trip) {
                    return res.status(404).json({ message: "Trip not found" });
                }
                item.trip = trip;
            }
            const updatedItem = await itemRepository.save(item);
            return res.json(updatedItem);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const item = await itemRepository.findByIdWithUser(Number(id));
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            if (req.user.role !== "admin" && item.user?.id !== userId) {
                return res.status(403).json({ message: "Access denied" });
            }
            await itemRepository.removeItem(item);
            return res.status(204).send();
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.ItemController = ItemController;
//# sourceMappingURL=ItemController.js.map