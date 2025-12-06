import express from 'express'
import cors from 'cors'
import dbConnect from './config/database.js';
import userRoutes from "./routes/userRoutes.js";
import TableRoutes from './routes/tableRoutes.js'
import verifyToken from './middleware/verifyToken.js';
import checkRole from './middleware/checkRole.js';



const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
// fn used for mongodb connection

dbConnect()
app.get('/menu', verifyToken, checkRole(['customer', 'admin']), (req, res) => {
    res.send({ message: 'Menu is available for you' });
});

app.get('/', (req,res)=>{
    res.send('Homepage')
})

// routes
app.use('/api',userRoutes)
app.use('/api' ,TableRoutes )


app.listen(3000, ()=>{
    console.log('server is running on port: http://localhost:3000')
}) 