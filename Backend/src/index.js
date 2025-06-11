
import dotenv from "dotenv/config";
import serverless from "serverless-http";
import connectDB from "./DB/index.js";
import { app } from "./app.js";

// Vercel calls this function per request, so we connect DB outside
let isConnected = false;

async function bootstrapApp() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return serverless(app);
}

export default async function handler(req, res) {
  const server = await bootstrapApp();
  return server(req, res);
}


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
// await connectDB();
// export const handler = serverless(app)
