
import express from "express";
import dotenv from "dotenv";
import mainRouter from "./Routes/indexRouting";



dotenv.config();

const PORT = process.env.PORT;
// const HOST=process.env.PG_HOST ;
const app = express();
// dbConnection();


app.listen(PORT, () => {
  console.log(`Server is running on port https://localhost:${PORT}`);
});

app.use(express.json());

app.use("/",mainRouter);