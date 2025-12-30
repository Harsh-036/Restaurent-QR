import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: Number,
    unique: true,  //order collection 4 order.countDocuments()+1
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // client=> localstorage
  },
  sessionToken: {
    type: String, //client => localstorage
  },
  items: [ //client or db ;
    {
      menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
      },
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
      },
      subTotal: {
        type: Number,
        required: true,
      },
    },
  ],
  subTotal: {
    type: Number,
  }, // db
  discountAmount: {
    type: Number,
  }, /// client or db
  coupanCode: {
    type: String,
  }, //client
  finalAmount: {
    type: Number,
  },// client
  tableNumber: {
    type: Number,
  }, //client
  customerEmail: {
    type: String,
  }, //client
  customerName: {
    type: String,
  }, //client
  notes: {
    type: String,
  },
});

const Order = mongoose.model("Order", orderSchema);

export default Order;

// {
//     orderNumber : 1 ,
//     userId : "32lkklwjrkjwl",
//     sessionToken : null ,
//     items : [
//         {menuItemId : 'fdafdsfd' , name : "burge" , price : 50 , quantiy : 2 , subtotal : 100}
//         {menuItemId : 'fdafdd' , name : "pizza"  , price : 100 , quantiy : 2 , subtotal : 200}
//     ],
//     subtotal : 300 ,
//     coupancode : 'first30' ,
//     discountAmount : 30 ,
//     finalAmount : 270 ,
//     tableNUmber : 2 ,
//     customerEmail : "ritesh@gmail.com",
//     customerName : "ritesh",
//     notes  : "add some cheese"
//  }
