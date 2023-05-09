import express from "express";
import { createProduct, updateProduct, getAllProducts, getSellerProducts, getProductById, addToCart, totalUserCart, CartByUser, removeFromCart, checkout } from "../controllers/ProductController.js";

const router = express.Router();


// Api to create product.
router.post('/createproduct', createProduct);
//Api to update product.
router.put('/updateproduct', updateProduct);
// Api to get all products.
router.get('/getallproducts', getAllProducts);
// Api to get product by category.
router.get('/getproductbyid/:id', getProductById);
// Api to get product by user Id.
router.get('/getsellerproducts/:userId', getSellerProducts);
// Api to add product into cart.
router.post('/addtocart', addToCart);
// Api to get total user cart
router.get('/totalusercart/:id', totalUserCart);
// Api to get all cart's of user
router.get('/cartbyuser/:id', CartByUser);
// Api to remove product from cart
router.delete('/removefromcart/:id', removeFromCart);
// Api to checkout product
router.post('/checkoutproduct', checkout);




export default router;