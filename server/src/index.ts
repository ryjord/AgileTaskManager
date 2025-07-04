import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";
/* Route import */

/* configurations */
const app = express();
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors({
  origin: ['https://your-allowed-origin.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));

/* Routes */
app.get('/', (req,res) => {
    res.send("this server is running correctly");
});

// Catch-all 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

// Error handling middleware

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const portEnv = process.env.PORT;
const port = portEnv && !isNaN(Number(portEnv)) ? Number(portEnv) : 3000;
if (portEnv && isNaN(Number(portEnv))) {
    console.error(`Invalid PORT value "${portEnv}". Falling back to 3000.`);
}
app.listen(port, () => {
    console.log(`Server Running On Port : ${port} `);
})