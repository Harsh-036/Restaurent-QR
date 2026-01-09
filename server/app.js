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
import cartRoutes from './routes/cartRoutes.js'
import allCoupans from './routes/coupanRoute.js'
import orderRoutes from './routes/orderRoutes.js'
import { createServer } from 'http';
import { Server } from 'socket.io';


dotenv.config()
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  // Join user-specific room for personalized updates
  socket.on('join-user-room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join admin room for admin-specific updates
  socket.on('join-admin-room', () => {
    socket.join('admin_room');
    console.log('Admin joined admin room');
  });
});

// Make io available to routes
app.set('io', io);
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
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
app.use('/api' , menuRoutes)
app.use('/api' , cartRoutes)
app.use('/api' , allCoupans)
app.use('/api', orderRoutes)

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


server.listen(3000, ()=>{
    console.log('server is running on port: http://localhost:3000')
})
