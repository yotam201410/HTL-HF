import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { addressRouter } from "./routes/addressRouter";

const app = express();
const PORT = process.env.PORT || 3000; // if env doesn't list a port, default being 3000

// Enable all CORS requests
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], // Allow necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allow necessary headers
}));

app.use(loggerMiddleware);
app.use(express.json());
app.use("/users", userRouter);
app.use("/addresses", addressRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`User server running on port ${PORT}`);
});
