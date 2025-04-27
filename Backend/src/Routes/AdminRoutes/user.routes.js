import { Router } from "express";
import { GetAllUsers } from "../../Controllers/AdminControllers/user.controller.js";
import { verifyJWT } from "../../Middlewares/auth.middleware.js";

const AdminUserRoute = Router();

// Route to get all users (protected with JWT authentication)
AdminUserRoute.get("/", verifyJWT, GetAllUsers);

export default AdminUserRoute;