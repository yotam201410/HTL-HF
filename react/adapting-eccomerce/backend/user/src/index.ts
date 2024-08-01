import express from "express";
import cors from "cors";
import { userRouter } from "./routes/userRouter";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { addressRouter } from "./routes/addressRouter";

const app = express();
const PORT = process.env.PORT || 3001; // if env doesn't list a port, default being 3000
app.use(cors());

app.use(loggerMiddleware);
app.use(express.json());
app.use("/users", userRouter);
app.use("/addresses", addressRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`User server running on port ${PORT}`);
});
