import express from "express";
import { register, login, refreshToken, updateUser, deleteUser } from "../controllers/authControllers.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.put("/update-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", verifyToken, deleteUser);

export default router;
