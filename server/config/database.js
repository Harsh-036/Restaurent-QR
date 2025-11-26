import mongoose from "mongoose";

const dbConnect = async() => {
    try{
        const connection = await mongoose.connect('mongodb+srv://harsh123:harsh%40123@cluster0.famxsr6.mongodb.net/Restaurent-qr?appName=Cluster0')
        console.log('db connected')
    }catch(error){
        console.log(error)
    }
}

export default dbConnect;

// mongodb+srv://harsh123:<db_password>@cluster0.famxsr6.mongodb.net/?appName=Cluster0