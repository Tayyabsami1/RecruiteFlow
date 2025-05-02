import { Router } from "express";
import { GetDashboardStats } from "../../Controllers/AdminControllers/stats.controller.js";
import { verifyJWT } from "../../Middlewares/auth.middleware.js";

const AdminStatsRoute = Router();

// Route to get dashboard statistics (protected with JWT authentication)
AdminStatsRoute.get("/", verifyJWT, GetDashboardStats);

export default AdminStatsRoute;