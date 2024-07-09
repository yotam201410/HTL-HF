import express from "express";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { orderRouter } from "./routes/orderRoutes";

const app = express();

const PORT = process.env.PORT || 3000; // if env doesnt list a port default being 3000

app.use(loggerMiddleware);
app.use(express.json());
app.use("/orders",orderRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Orders server running ${PORT}`);
})
