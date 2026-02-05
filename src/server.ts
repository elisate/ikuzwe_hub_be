import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // 1. Import cors
import mainRouter from "./Routes/indexRouting";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// 2. Configure CORS options
const corsOptions = {
  origin: "http://localhost:8080", // Allow only this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // Allow cookies if needed
  optionsSuccessStatus: 200 
};

// 3. Use CORS middleware before your routes
app.use(cors(corsOptions));

app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});