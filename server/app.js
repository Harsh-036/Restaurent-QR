import express from 'express'
import cors from 'cors'
import dbConnect from './config/database.js';
import authRoutes from "./routes/authRoutes.js";
import TableRoutes from './routes/tableRoutes.js'
// import verifyToken from './middleware/verifyToken.js';
import checkRole from './middleware/checkRole.js';
import sessionRoutes from './routes/sessionRoutes.js'
import logger from './config/logger.js';
import verifyAuth from './middleware/verifyAuth.js';
import menuRoutes from './routes/menuRoute.js'
import dotenv from 'dotenv';




const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
// fn used for mongodb connection

dbConnect()
app.get('/menu', verifyAuth, checkRole(['customer', 'admin']), (req, res) => {
    res.send({ message: 'Menu is available for you' });
});

app.get('/', (req,res)=>{
    res.send('Homepage')
})

// routes
app.use('/api',authRoutes)
app.use('/api' ,TableRoutes )
app.use('/api' , sessionRoutes)
app.use('/api/' , menuRoutes)

//here we placed the global error handleer => 
  app.use((err,req,res,next)=>{
    if(err){
       // ----------- LOGGER ---------------
    logger.error(`
      STATUS: ${err.status || 500}
      MESSAGE: ${err.message}
      URL: ${req.originalUrl}
      METHOD: ${req.method}
      IP: ${req.ip}
    `);
    // -----------------------------------
      res.status(err.status || 500).json({
        messsage : err?.message || 'server error'
      })
    }
  })


app.listen(3000, ()=>{
    console.log('server is running on port: http://localhost:3000')
}) 