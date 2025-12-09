import mongoose from 'mongoose' ;

const menuSchema = new mongoose.Schema({
 name : {
    type : String 
 },  //ui se aayega
 description : {
   type : String
 }, //ui se aayege
 image : {
    type : String
 }, //ui in binary => parse => cloudinary save
 isAvailable : {
   type : String  ,
   default : true
 },  //ui
 price : {
    type : Number
 }, //ui
 category : {
    type : String
 } //ui
})


const Menu = mongoose.model('Menu' , menuSchema) ;

export default Menu