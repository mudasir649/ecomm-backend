import mongoose, { mongo } from "mongoose";

const CartSchema = new mongoose.Schema({
    quantity:{
        type: Number,
        required:[true, "Quantity is required."]
    },
    productId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"products"
    },
    userId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref:"users",
    },
}, 
    { timestamps: true }
);

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;