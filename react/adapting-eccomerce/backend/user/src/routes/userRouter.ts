import { Router } from "express";
import {
  getAddressesHandler,
  getUserByIDHandler,
  loginHandler,
  registerHandler,
  removeUserHandler,
  updateDefaultAddressHandler,
  updateUserHandler,
} from "../controllers/userController";
export const userRouter: Router = Router();

userRouter.post("/login", loginHandler);
userRouter.post("/register", registerHandler);
userRouter.get("/:username/addresses", getAddressesHandler);
userRouter.delete("/:user_id", removeUserHandler);
userRouter.patch("/address", updateDefaultAddressHandler);
userRouter.patch("/", updateUserHandler);
userRouter.get("/:user_id", getUserByIDHandler);
