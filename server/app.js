import express from 'express'
import cors from 'cors'
import dbConnect from './config/database.js';
import userRoutes from "./routes/userRoutes.js";



const app = express();
app.use(cors())
app.use(express.json())
// fn used for mongodb connection

dbConnect()

app.get('/', (req,res)=>{
    res.send('Homepage')
})

// routes
app.use('/api',userRoutes)

app.listen(3000, ()=>{
    console.log('server is running on port: http://localhost:3000')
}) 