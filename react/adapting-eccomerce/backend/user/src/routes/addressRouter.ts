import { Router } from "express";
import { changeAddressHandler, createAddressHandler, getAddressByIDHandler, removeAddressHandler } from "../controllers/addressController";

export const addressRouter = Router();
addressRouter.get("/:id", getAddressByIDHandler);
addressRouter.post("/", createAddressHandler);
addressRouter.delete("/", removeAddressHandler);
addressRouter.patch("/", changeAddressHandler);