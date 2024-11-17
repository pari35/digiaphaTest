import ErrorHandler from "../utils/errorHandler.js"
import catchAsyncError from "../middleware/catchAsycError.js"
import sendToken from "../utils/jwttoken.js"
import User from "../models/userModel.js"
import joi from "joi"
import ApiFeatures from "../utils/apiFeature.js"

//register a user
const registerUser = catchAsyncError(async (req, res, next) => {
    const { email, password, firstName, lastName, phone } = req.body

    // validate user input
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).alphanum().required(),
        firstName: joi.string().min(3).max(100).required(),
        lastName: joi.string().min(3).max(100).required(),
        phone: joi.string().min(3).max(10)
    })
    const { error, value } = schema.validate(req.body)
    if (error) {
        return res.status(400).json({ message: "Bad request", error })
    }

    //and register user in DB
    const user = await User.create({
        email, password, firstName, lastName, phone
    })
    if(user){
        return res.status(200).json({ message: "User Registartion successful" })
    }
})

//login user
const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    // checking if user has given password and email both 
    if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password");
    
    if (!user) {
        return next(new ErrorHandler("invalid email or password"), 401)
    }
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password"), 401)
    }
    user.password = undefined
    const token = user.getJWTToken();

    sendToken(user, 200, res)

})

//get user by id
const getUserById = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.query.id,{firstName:1,email:1,lastName:1,phone:1})
    if (!user) {
        return next(new ErrorHandler("User does not exist ", 400))
    }
    res.status(200).json({
        success: true,
        user
    })
})

//update user
const getUpdateUser = catchAsyncError(async (req, res) => {
    let userExist = await User.findById(req.query.id)

    if (!userExist) {
        return res.status(500).json({
            success: "false",
            message: "User not found"
        })
    }
   const userData = await User.findByIdAndUpdate({_id:req.query.id}, req.body)
    res.status(200).json({
        success: "true",
        userData
    })
})

// delete user - admin
const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.query.id)

    if (!user) {
        next(new ErrorHandler("User does not exist with id"))
    }
    await user.deleteOne()
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

//logout user
const logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged out"
    })

})

// get all Users
const getAllUsers = catchAsyncError(async (req, res) => {
    const resultPerPage = 10
    const userCount = await User.countDocuments()

    const apiFeature = new ApiFeatures(User.find({},{firstName:1,email:1,lastName:1,phone:1}), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const userData = await apiFeature.query

    res.status(200).json({
        success: true,
        userData,
        userCount,
        resultPerPage
    })
})

export {
    registerUser,
    loginUser,
    getUserById,
    getUpdateUser,
    deleteUser,
    logoutUser,
    getAllUsers
}