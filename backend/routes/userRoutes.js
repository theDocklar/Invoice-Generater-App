import express from "express";
import {
  registerUser,
  loginUser,
  getUserById,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/:id", deleteUser);

export default router; 
