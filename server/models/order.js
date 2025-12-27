import mongoose from 'mongoose' ;



const orderSchema = new mongoose.Schema({
    productName : {
        type   : String
    }
}
)

const Order = mongoose.model("model" , orderSchema) ;

export default Order 