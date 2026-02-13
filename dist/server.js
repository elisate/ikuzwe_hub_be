"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // 1. Import cors
const indexRouting_1 = __importDefault(require("./Routes/indexRouting"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const app = (0, express_1.default)();
// 2. Configure CORS options
const corsOptions = {
    origin: "http://localhost:8080", // Allow only this origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow cookies if needed
    optionsSuccessStatus: 200
};
// 3. Use CORS middleware before your routes
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use("/", indexRouting_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
