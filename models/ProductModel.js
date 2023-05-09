import { mongoose, Schema } from "mongoose";

const ProductSchema = new Schema({
    image: {
        type: String,
        required: [true, "Image is required."]
    },
    category: {
        type: String,
        required: [true, "Category is required."]
    },
    productName: {
        type: String,
        required: [true, "Product name is required."]
    },
    price: {
        type: String,
        required: [true, "Product price is required."]
    },
    size: {
        type: String,
    },
    color: {
        type: String,
        required: [true, "Color is required."]
    },
    description: {
        type: String,
        required: [true, "description is required."]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
}, { timestamps: true })


const Product = mongoose.model('Product', ProductSchema);

export default Product;