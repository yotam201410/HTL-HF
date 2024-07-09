import express from "express";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { productRouter } from "./routes/productRouter";

const app = express();

const PORT = process.env.PORT || 3000; // if env doesnt list a port default being 3000

app.use(loggerMiddleware);
app.use(express.json());
app.use("/products",productRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`User server running ${PORT}`);
})
