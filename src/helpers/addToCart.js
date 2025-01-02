import { toast } from "react-toastify";
import { summaryApi } from "../common";

const addToCart = async(e, id, fetchUserAddToCart) => {

    
    e.preventDefault();
    e?.stopPropagation()

    try {
        const response = await fetch(summaryApi.addToCart.url, {
            method: summaryApi.addToCart.method,
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: id
            })
        });

        const responseData = await response.json();
        
        if(responseData.success){
            
            fetchUserAddToCart();
            toast.success(responseData.message)
        } else {
            toast.error(responseData.message || "Failed to add to cart")
        }

    } catch (error) {
        toast.error(error.message)
        console.log("Error in addToCart", error)        
    }
}

export default addToCart;