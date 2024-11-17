import express from "express"
import { assignRoles, createUserRoles } from "../controllers/roleController.js"
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js"

const router = express.Router()
router.route("/createUserRoles").post(isAuthenticatedUser,authorizeRoles(1,2),createUserRoles)
router.route("/assignRoles").post(isAuthenticatedUser,authorizeRoles(1,2),assignRoles)

export default router