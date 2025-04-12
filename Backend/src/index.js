import { app } from "./app.js";
import dotenv from "dotenv/config";
import connectDB from "./DB/index.js";

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Server Error ", err)
        throw new Error(err);
    })
    app.listen(process.env.PORT || 800, () => {
        console.log("Server is Started on port", process.env.PORT);
    })
})
.catch((err) => console.log(err));
