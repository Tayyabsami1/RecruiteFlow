import { Router } from "express";
import { LoginUser,LogoutUser,SignUpUser,AuthorizationCheck } from "../Controllers/auth.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

const authRouter=Router();

authRouter.route('/login').post(LoginUser);

authRouter.route('/signup').post(SignUpUser);

authRouter.route('/logout').post(LogoutUser);
authRouter.route('/').get(AuthorizationCheck);

export default authRouter;