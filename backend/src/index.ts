import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import indexApp from './routes/index.js';
dotenv.config();

const port = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use(express.Router());

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.get('/',(req,res)=>{
    res.send('Hello World!');
});

app.use('/api/v1',indexApp);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});