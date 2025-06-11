import { app } from "./app.js";
import dotenv from "dotenv/config";
import connectDB from "./DB/index.js";
import serverless from "serverless-http"

// connectDB().then(() => {
//     app.on("error", (err) => {
//         console.log("Server Error ", err)
//         throw new Error(err);
//     })
//     app.listen(process.env.PORT || 8000, () => {
//         console.log("Server is started on port", process.env.PORT );
//     });
    
// })
// .catch((err) => console.log(err));
await connectDB();
export const handler = serverless(app)
