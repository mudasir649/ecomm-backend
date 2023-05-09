import mongoose, { isValidObjectId} from "mongoose";
import Product from "../models/ProductModel.js";
import Cart from "../models/CartModel.js";
import { v4 } from "uuid"
import { successResponse, failedResponse } from "../utils/response.js";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51MfmtsFYIXNQRXXwLRl0wDsiERx9FJVetURDNTaNNnKxShz1EL7IaqhYNw3zmtWmcRoE0eLq2u2ewErP0xe0kkDC00CWPlhMfx');

const createProduct = async(req, res) => {
    const { productData, userId} = req.body;
    const data = {
        image: productData?.image,
        category: productData?.category,
        productName: productData?.productName,
        price: productData?.price,
        color: productData?.color,
        description: productData?.description,
        size: productData?.size,
        userId: userId
    }
    try {
        if(!productData.image || !productData?.category || !productData?.productName || !productData?.price || !productData?.description ){
            return failedResponse(res, "Please! enter all input input fields to create product.");
        }else{
            const product = await Product.create(data);
            return successResponse(
                res,
                "Product is created successfully.",
                true,
                product
            )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to create product. Please! try again.",
            false
        )
    }
}


const updateProduct = async(req, res) => {
    const { image, category, productName, price, color, description } = req.body;
    console.log(req.body);
    // try {
    //     if(image || category || productName || price || color || description){
    //         return failedResponse(res, "Please! enter all input input fields to update product.");
    //     }else{
    //         const product = await Product.create(req.body);
    //         return successResponse(
    //             res,
    //             "Product is created successfully.",
    //             true,
    //             product
    //         )
    //     }
    // } catch (error) {
    //     return failedResponse(
    //         res,
    //         "Failed to create product. Please! try again.",
    //         false
    //     )
    // }
}


const getAllProducts = async(req, res) => {

    const { name } = req.query;

    try {
        const product = await Product.find({category: name})
        if(product){
            return successResponse(
                res,
                "All products retrived successfully.",
                true,
                product
                )
        }else{
            return successResponse(
                res, 
                "No Product exits.",
                true,
                )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to retrive all products.",
            false
        )
    }
}


const getProductById = async(req, res) => {

    const { id } = req.params;

    try {
        const product = await Product.findOne({_id: id})
        if(product){
            return successResponse(
                res,
                "All products retrived successfully.",
                true,
                product
                )
        }else{
            return successResponse(
                res, 
                "No Product exits.",
                true,
                )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to retrive all products.",
            false
        )
    }
}

const getSellerProducts = async(req, res) => {
    const { id } = req.query;
    try {
        const products = await Product.findById(id);
        if(products){
            return successResponse(
                res,
                "All sellers products are retrived successfully.",
                true,
                products
            )
        }else{
            return successResponse(
                res,
                "No product exits.",
                true
            )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to retrieve sellers products.",
            false
        )
    }
}

const addToCart  = async(req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        if(!userId || !productId || !quantity){
            return failedResponse(
                res,
                "No user or product Id exists for cart.",
                false
            )
        }else{
            const cart = await Cart.create(req.body);
            return successResponse(
                res,
                "Product added to cart successfully.".
                true,
                cart
                )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to add product into cart.",
            false
        )
    }
}


const totalUserCart = async(req, res) => {
    const { id } = req.params;
    try {
        const cart = await Cart.find({userId:id}).count();
        return successResponse(
            res,
            "Total user cart retrieved successfully.",
            true,
            cart
        )
    } catch (error) {
        return failedResponse(
            res,
            "Failed to retrieve user's cart.",
            false
        )
    }
}

const returnCart = async(userId, req, res) => {
    let cartProducts;
    cartProducts = await Cart.aggregate([
        {
            $match:{
                "userId": userId
            }
        },
        {
            $lookup:{
                from:"products",
                localField:"productId",
                foreignField:"_id",
                as:"productData"
            }
        }
    ])
    return successResponse(
        res,
        "User all cart is retrieved successfully.",
        true,
        cartProducts
    )
}

const CartByUser = async(req, res) => {
    const { id } = req.params;
    let userId;
    try {
        userId = new mongoose.Types.ObjectId(id);
        if(isValidObjectId(userId)){
            returnCart(userId, req, res);
        }
        else{
            userId = new mongoose.Schema.Types.ObjectId(id);
            returnCart(userId, req, res)
        }
        
    } catch (error) {
        return failedResponse(
            res,
            "Failed to retrieve user's all cart.",
            false
        )
    }
}

const removeFromCart = async(req, res) => {
    const { id } = req.params
    try {
        const exisitngCart = await Cart.findOne({_id: id});
        if(exisitngCart){
            const cart = await Cart.deleteOne({_id:id});
            return successResponse(
                res,
                "Product is removed from the cart successfully.",
                true,
                cart
                )
        }else{
            return failedResponse(
                res,
                "Product not exists in cart.",
                false
            )
        }
    } catch (error) {
        return failedResponse(
            res,
            "Failed to remove product from cart.",
            false
        )
    }
}


const checkout = async(req, res) => {
    const { totalAmount, user } = req.body;

    try {
        const checkoutPayment = await stripe.paymentIntents.create({
            amount: totalAmount,
            receipt_email: user?.email,
            currency: 'usd'
        }, )
    
        return successResponse(
            res,
            "Porduct is checkedout.",
            true,
            checkoutPayment.client_secret
        )
    } catch (error) {
        return failedResponse(
            res,
            "Failed to checkout product.",
            false
        )
    }
}


export {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductById,
    getSellerProducts,
    addToCart,
    totalUserCart,
    CartByUser,
    removeFromCart,
    checkout
}