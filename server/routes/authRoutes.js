import express from "express";
import { register, login, refreshToken, updateUser, deleteUser, findAccount, resetPassword, forgetPassword, getUser, googleSignIn } from "../controllers/authControllers.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/user", verifyToken, getUser);
router.put("/update-user/:id", verifyToken, updateUser);
router.delete("/delete-user/:id", verifyToken, deleteUser);
router.post("/find-account", findAccount);
router.post("/reset-password", resetPassword);
router.post("/forget-password", forgetPassword);
router.post("/google-signin", googleSignIn);

export default router;
