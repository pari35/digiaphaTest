import mongoose from "mongoose"

const roleSchema = new mongoose.Schema({
    roleId: {
        type: Number,  // 1 -super admin 2- admin
        select: false,
        default: 3
    },
    roleName: {
        type: String,
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("roleSchema", roleSchema);