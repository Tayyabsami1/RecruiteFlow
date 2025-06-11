import dotenv from "dotenv/config";
import serverless from "serverless-http";
import connectDB from "./DB/index.js";
import { app } from "./app.js";

connectDB().then(() => {
    app.on("error", (err) => {
        console.log("Server Error ", err)
        throw new Error(err);
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log("Server is started on port", process.env.PORT );
    });
    
})
.catch((err) => console.log(err));
