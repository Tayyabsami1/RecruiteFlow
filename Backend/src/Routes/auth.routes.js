import { Router } from "express";
import { LoginUser,LogoutUser,SignUpUser,AuthorizationCheck } from "../Controllers/auth.controller";
import { verifyJWT } from "../Middlewares/auth.middleware";

const Router=Router();

Router.route('/login').post(LoginUser);

Router.route('/signup').post(SignUpUser);

Router.route('/logout').post(verifyJWT, LogoutUser);
Router.route('/').get(AuthorizationCheck);

export default Router;