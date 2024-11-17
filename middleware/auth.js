import catchAsycError from "./catchAsycError.js"
import jwt from "jsonwebtoken"
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js"

const isAuthenticatedUser = catchAsycError(async (req, res, next) => {
    const { token } = req.cookies;
    console.log("req.cookies", req.cookies)
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, 'lksdjfyusbj');

    req.user = await User.findById(decodedData.id).select("roleId")

    next();
});

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.roleId)) {
            return next(
                new ErrorHandler(
                    `Role: ${req.user.role} is not allowed to access this resource `, 403
                )
            )
        }
        next()
    }

}

export {
    isAuthenticatedUser,
    authorizeRoles
}