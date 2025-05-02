import { Router } from "express";
import { verifyJWT } from "../../Middlewares/auth.middleware.js";
import { DeleteUser, EditUser, GetAllUsers } from "../../Controllers/AdminControllers/user.controller.js";

const AdminUserRoute = Router();

// Route to get all users (protected with JWT authentication)
AdminUserRoute.get("/", verifyJWT, GetAllUsers);

// Route to delete a user by ID from request body (protected with JWT authentication)
AdminUserRoute.delete("/", verifyJWT, DeleteUser);

// Route to edit a user (protected with JWT authentication)
AdminUserRoute.put("/", verifyJWT, EditUser);

export default AdminUserRoute;