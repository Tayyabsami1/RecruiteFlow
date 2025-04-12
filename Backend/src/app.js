import express from 'express';
import cors from "cors"
import cookieparser from 'cookie-parser'
const app = express();

// Some security options using Middlewares
app.use(express.json({ limit: "16kb" }));

// like to encode space to %20 or +
app.use(express.urlencoded({
    extended: true,
    limit: "16kb",
}))

app.use(cookieparser())

// Configuring the Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));


export { app };