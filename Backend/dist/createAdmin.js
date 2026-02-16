"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Data_source_1 = require("./config/Data-source");
const User_1 = require("./models/User");
async function createAdmin() {
    await Data_source_1.AppDataSource.initialize();
    const user = new User_1.User("Admin", "admin@gmail.com", "root");
    user.role = "admin";
    await Data_source_1.AppDataSource.manager.save(user);
    console.log("Admin criado com sucesso!");
    process.exit(0);
}
createAdmin().catch(console.error);
//# sourceMappingURL=createAdmin.js.map