import express from 'express' ;
// import { RotationGestureHandler } from 'react-native-gesture-handler';
import verifyToken from '../middlewares/verifyToken';
import checkRole from '../middlewares/checkRole';


const router = express.Router() ;


//get all user //token user login => verify token , admin
router.get('/users', verifyToken , checkRole(['admin'], ))