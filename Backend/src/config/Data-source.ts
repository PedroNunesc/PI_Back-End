import "reflect-metadata";
import { DataSource } from "typeorm";

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL não definida! Verifique as variáveis de ambiente no Render."
  );
}

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL,
  synchronize: false,
  logging: true,
  entities: [__dirname + "/../models/*.ts"],

  extra: {
    ssl: {
      rejectUnauthorized: false, 
    },
  },
});
