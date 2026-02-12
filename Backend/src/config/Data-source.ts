import "reflect-metadata";
import { DataSource } from "typeorm";

if (process.env.NODE_ENV !== "production") {
  import("dotenv").then(dotenv => dotenv.config());
}

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_PORT || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  throw new Error("Erro: Variáveis de ambiente do banco não definidas!");
}

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: Number(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    logging: true,
    entities: [__dirname + "/../models/*.ts"],
});
