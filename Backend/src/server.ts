import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/Data-source.ts";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";
import tripRoutes from "./routes/TripRoutes";
import itemRoutes from "./routes/ItemRoutes";

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

