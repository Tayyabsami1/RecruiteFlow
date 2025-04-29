import { Router } from "express";
import { DeleteUser, GetAllUsers } from "../../Controllers/AdminControllers/user.controller.js";
import { verifyJWT } from "../../Middlewares/auth.middleware.js";

const AdminUserRoute = Router();

// Route to get all users (protected with JWT authentication)
AdminUserRoute.get("/", verifyJWT, GetAllUsers);

// Route to delete a user by ID from request body (protected with JWT authentication)
AdminUserRoute.delete("/", verifyJWT, DeleteUser);

export default AdminUserRoute;