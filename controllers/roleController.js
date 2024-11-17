import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncError from "../middleware/catchAsycError.js"
import joi from "joi"
import Role from "../models/roleModel.js"
import User from "../models/userModel.js"

// create user roles - admin
const createUserRoles = catchAsyncError(async (req, res, next) => {
    const { roleId, roleName } = req.body
    const roleExist = await Role.findOne({ roleId: roleId })

    if (roleExist) {
        next(new ErrorHandler("User does not exist with id"))
    }

    // validate user input
    const schema = joi.object({
        roleId: joi.number().min(1).max(10).required(),
        roleName: joi.string().min(3).max(100).required(),
    })

    const { error, value } = schema.validate(req.body)

    if (error) {
        return res.status(400).json({ message: "Bad request", error })
    }

    const createRole = await Role.create({
        roleId, roleName
    })

    res.status(200).json({
        success: true,
        message: "user role created Successfully"
    })
})

const assignRoles = catchAsyncError(async (req, res, next) => {
    let userExist = await User.findById(req.query.id)

    if (!userExist) {
        return res.status(500).json({
            success: "false",
            message: "User not found"
        })
    }

    if (!req.body.roleId) {
        return res.status(500).json({
            message: "Please enter roleId"
        })
    }
    const userData = await User.findByIdAndUpdate({ _id: req.query.id }, { roleId: req.body.roleId })
    res.status(200).json({
        success: "true",
        userData
    })
})

export {
    createUserRoles,
    assignRoles
}