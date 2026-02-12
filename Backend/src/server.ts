import express from "express";
import { AppDataSource } from "./config/AppDataSource"; 
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import tripRoutes from "./routes/TripRoutes";
import itemRoutes from "./routes/ItemRoutes";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", tripRoutes);
app.use("/api", itemRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Banco conectado com sucesso!");
    app.listen(PORT, () => {
      console.log(`Server rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err);
  });
