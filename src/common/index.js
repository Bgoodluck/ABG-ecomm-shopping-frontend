const backendURL = process.env.REACT_APP_BACKEND_URL || "https://abg-ecomm-shopping-backend.onrender.com"

export const summaryApi = {
    signUp : {
        url: `${backendURL}/api/user/signup`,
        method: "POST",
        data: {
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            profilePic: String,
            role: String
        }
    },

    signIn :{
        url: `${backendURL}/api/user/login`,
        method: "POST",
        data: {
            email: String,
            password: String
        }
    },

    current_user :{
        url: `${backendURL}/api/user/user-details`,
        method: "GET"
    },

    logout: {
        url: `${backendURL}/api/user/logout`,
        method: "GET"
    },

    allUser: {
        url: `${backendURL}/api/user/all-users`,
        method: "GET"
    },

    updateUser: {
        url: `${backendURL}/api/user/update-user`,
        method: "POST",
        data: {
            userId: String,
            firstName: String,
            lastName: String,
            email: String,            
            role: String
        }
    },

    getUserDetailsId: {
        url: `${backendURL}/api/user`,
        method: "GET",
        // data: {
        //     userId: String
        // }
    },

    uploadProduct: {
        url: `${backendURL}/api/product/upload-product`,
        method: "POST"        
    },

    allProducts: {
        url: `${backendURL}/api/product/get-products`,
        method: "GET"
    },

    updateProduct: {
        url: `${backendURL}/api/product/update-product`,
        method: "POST",
        data: {
            productId: String,
            productName: String,
            productPrice: Number,
            productDescription: String,
            productsCategory: String,
            productBrand: String,
            productImage: [],
            productDiscount: Number            
        }
    },

    categoryProduct: {
        url: `${backendURL}/api/product/list-category`,
        method: "GET",
        data: {
            productsCategory: String
        }
    },

    allProductCategories: {
        url: `${backendURL}/api/product/all-categories`,
        method: "POST"
    },

    productDetails: {
        url: `${backendURL}/api/product/product-details`,
        method: "GET",
        data: {            
            productName: String,
            productPrice: Number,
            productDescription: String,
            productsCategory: String,
            productBrand: String,
            productImage: [],
            productDiscount: Number            
        }        
    },

    postReview: {
        url: `${backendURL}/api/review/post-review`,
        method: "POST",
        data: {
            productId: String,
            userId: String,
            rating: Number,
            comment: String
        }
    },

    getReviews: {
        url: `${backendURL}/api/review/get-review`,
        method: "GET",
        data: {
            productId: String
        }
    },

    updateReview: {
        url: `${backendURL}/api/review/update-review`,
        method: "POST",
        data: {
            reviewId: String,
            userId: String,
            rating: Number,
            comment: String
        }
    },

    deleteReview: {
        url: `${backendURL}/api/review/delete-review`,
        method: "DELETE",
        data: {
            reviewId: String,
            userId: String
        }
    },

    addToCart: {
        url: `${backendURL}/api/cart/addtocart`,
        method: "POST",
        data: {
            userId: String,
            productId: String,
            quantity: Number
        }
    },

    cartCounter: {
        url: `${backendURL}/api/cart/countaddtocart`,
        method: "GET",
        
    },

    cartList: {
        url: `${backendURL}/api/cart/cartView`,
        method: "GET",
        data: {
            userId: String
        }
    },

    deleteCart: {
        url: `${backendURL}/api/cart/delete-cart`,
        method: "DELETE",
        data: {
            userId: String,
            productId: String
        }
    },

    updateCart: {
        url: `${backendURL}/api/cart/update-cart`,
        method: "POST",
        data: {
            _id: String,
            quantity: Number
        }
    },

    searchProducts: {
        url: `${backendURL}/api/review/search`,
        method: "GET"        
    },
    
    filterProducts: {
        url: `${backendURL}/api/review/filter`,
        method: "POST",        
    },

    cod: {
        url: `${backendURL}/api/order/cod`,
        method: "POST",
        data: {
            userId: String,
            products: [{
                productId: String,
                quantity: Number
            }]
        }
    },

    stripe: {
        url: `${backendURL}/api/order/stripe`,
        method: "POST",
        data: {
            userId: String,
            products: [{
                productId: String,
                quantity: Number
            }],
            totalPrice: Number
        }
    },

    stripeVerify: {
        url: `${backendURL}/api/order/verifyStripe`,
        method: "POST",        
    },

    flutterwave: {
        url: `${backendURL}/api/order/flw`,
        method: "POST",
        data: {
            userId: String,
            products: [{
                productId: String,
                quantity: Number
            }],
            totalPrice: Number
        }
    },

    flutterwaveVerify: {
        url: `${backendURL}/api/order/verifyFlw`,
        method: "POST",        
    },

    orderHistory: {
        url: `${backendURL}/api/order/userorders`,
        method: "POST",
        data: {
            userId: String
        }
    },

    AdminOrderInventory: {
        url: `${backendURL}/api/order/list`,
        method: "POST"
    },

    OrderStatus: {
        url: `${backendURL}/api/order/status`,
        method: "POST",
        data: {
            orderId: String,
            status: String
        }
    },

    getProfileDetails: {
        url: `${backendURL}/api/profile/get`,
        method: "GET",
        data: {
            userId: String
        }
    },

    updateProfileDetails: {
        url: `${backendURL}/api/profile/update`,
        method: "POST",
        data: {
            userId: String,
            profilePic: String,
            address: String,            
            phone: String
        }
    },

    newsletterSubcription:{
        url: `${backendURL}/api/newsletter/register`,
        method: "POST",
        data: {
            email: String
        }
    },

    getNewsletterSubcription:{
        url: `${backendURL}/api/newsletter/list`,
        method: "GET",
        data: {
            email: String
        }
    },

    sendNewsletterSubcription:{
        url: `${backendURL}/api/newsletter/send`,
        method: "POST",
        data: {
            email: String,
            status: Boolean
        }
    },

    unSubscribeNewsletter: {
        url: `${backendURL}/api/newsletter/unsubscribe`,
        method: "POST",
        data: {
            email: String
        }
    },

    deleteSubscription:{
        url: `${backendURL}/api/newsletter/delete/:email`,
        method: "DELETE",
        data: {
            email: String
        }
    },

    updateSubscriberStatus: {
        url: `${backendURL}/api/newsletter/status/:email`,
        method: "POST",
        data: {
            email: String,
            isActive: Boolean
        }
    },

    chatMessageAssistant: {
        url: `${backendURL}/api/chat/history/:userId`,
        method: "GET",
        data: {
            userId: String,
            message: String
        }
    },

    openAi: {
        url: `${backendURL}/api/openai/generate-response`,
        method: "POST",
        // data: {
        //     userId: String,
        //     message: String
        // }
    }
}



// checkout: {
//     url: `${backendURL}/api/cart/checkout`,
//     method: "POST",
//     data: {
//         userId: String,
//         products: [{
//             productId: String,
//             quantity: Number
//         }]
//     }
// },