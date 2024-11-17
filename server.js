import app from "./app.js"
import dotenv from "dotenv"
import connectDatabase from "./config/database.js"

dotenv.config({path:"config/config.env"})
connectDatabase()
//handling uncaught exception
process.on("uncaught error exception", (err) => {
    console.log("errr", err.message);
    console.log("Shutting down the due to unhandled promise rejection");
    server.close(() => {
        process.exit(0)
    })
})
console.log("env port", process.env.PORT)
const server = app.listen(process.env.PORT, () => {
    console.log('server is working on port');
})

//unhandled promise rejection
process.on("unhandledRejection", err => {
    console.log("errr", err.message);
    console.log("Shutting down the server");
    server.close(() => {
        process.exit(0)
    })
})