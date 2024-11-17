import express from "express"
import {registerUser ,loginUser,getUserById, getUpdateUser, deleteUser, logoutUser, getAllUsers} from "../controllers/userController.js"
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js"

const router = express.Router()
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/getUserById").post(isAuthenticatedUser,getUserById)
router.route("/getUpdateUser").put(isAuthenticatedUser,authorizeRoles(1,2),getUpdateUser)
router.route("/deleteUser").delete(isAuthenticatedUser,authorizeRoles(1,2),deleteUser)
router.route("/getAllUsers").get(isAuthenticatedUser,getAllUsers)
export default router