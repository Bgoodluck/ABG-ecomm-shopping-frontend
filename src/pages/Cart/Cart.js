import React, { useContext, useEffect, useState } from 'react'
import { summaryApi } from '../../common';
import Context from '../../context';
import { MdDelete } from 'react-icons/md';
import { FaPlus, FaMinus, FaShoppingCart, FaTag, FaReceipt } from 'react-icons/fa';
import { displayNGNCurrency } from '../../helpers/displayCurrency';
import { Link } from 'react-router-dom';

function Cart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context)
    const loadingCart = new Array(context.cartCount || 4).fill(null)

    
    const fetchData = async () => {
        // setLoading(true);
        try {
            const response = await fetch(summaryApi.cartList.url, {
                method: summaryApi.cartList.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();

            if (responseData.success) {
                let cartData = [];

                if (responseData.data && responseData.data.cartItems && responseData.data.products) {
                    cartData = responseData.data.cartItems.products.map(cartItem => {
                        const product = responseData.data.products.find(
                            p => p._id === cartItem.productId
                        );
                        return {
                            ...product,
                            cartItemId: cartItem._id,
                            quantity: cartItem.quantity
                        };
                    });
                }

                setData(cartData);
            } else {
                console.error('Failed to fetch cart data');
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
            setData([]);
        } finally {
            // setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId, qty) => {
        // setLoading(true);
        try {
            const response = await fetch(summaryApi.updateCart.url, {
                method: summaryApi.updateCart.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    _id: cartItemId,
                    quantity: qty
                })
            });

            const responseData = await response.json();

            if (responseData.success) {
                await fetchData();
                context.fetchUserAddToCart();
            } else {
                console.error('Failed to update cart item');
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        } finally {
            // setLoading(false);
        }
    }

    const handleRemoveCart = async (cartItemId) => {
        // setLoading(true);
        try {
            const response = await fetch(summaryApi.deleteCart.url, {
                method: summaryApi.deleteCart.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ _id: cartItemId })
            });

            const responseData = await response.json();

            if (responseData.success) {
                await fetchData();
                context.fetchUserAddToCart();
            } else {
                console.error('Failed to remove cart item');
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        } finally {
            // setLoading(false);
        }
    }

    const calculateTotal = () => {
        return data.reduce((total, product) => {
            const price = product.productPrice ||
                product.productId?.productPrice ||
                product.price ||
                0;
            const quantity = product.quantity || 1;
            return total + (quantity * price);
        }, 0)
    }


    
    const handleLoading = async ()=>{
        setLoading(true)
        await fetchData()
        setLoading(false)
    }


    useEffect(() => {
        handleLoading()
    }, [])



    return (
        <div className="container mx-auto px-4 py-8">
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loadingCart.map((_, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-gray-200 to-gray-300 h-32 animate-pulse rounded-lg"
                        ></div>
                    ))}
                </div>
            ) : (
                <div className="max-w-5xl mx-auto">
                    {data.length === 0 ? (
                        <div className="bg-gradient-to-r from-blue-200 to-purple-300 py-16 rounded-2xl flex flex-col items-center justify-center text-center">
                            <FaShoppingCart className="text-6xl text-blue-600 mb-6 animate-bounce" />
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
                            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
                            <Link to={"/"} className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className=" text-lg lg:text-2xl font-bold text-gray-800 flex items-center gap-3">
                                    <FaShoppingCart className="text-blue-600" />
                                    My Cart
                                </h2>
                                <div className='hidden lg:block'>Quantity: {context?.cartCount}</div>
                                <div className="flex items-center gap-4">
                                    <span className="text-gray-800 bg-gray-100 px-3 text-sm lg:text-lg py-1 rounded-full">
                                        {data.length} Items
                                    </span>
                                    <div className="text-blue-700 font-bold text-sm lg:text-lg">
                                        <span className='text-red-600 text-lg'>Total:</span> {displayNGNCurrency(calculateTotal())}
                                    </div>
                                </div>
                            </div>

                            {/* Cart Items Section */}
                            <div className="space-y-6">
                                {data.map((product) => {
                                    const productDetails = product.productId || product;
                                    const productName = productDetails.productName || productDetails.name || 'Unknown Product';
                                    const productsCategory = productDetails.productsCategory || productDetails.category || "Unknown Category";
                                    const productPrice = productDetails.productPrice || productDetails.price || 0;
                                    const productImage = (productDetails.productImage || [])[0] || '';
                                    const productQuantity = product.quantity || 1;

                                    return (
                                        <div
                                            key={product._id}
                                            className="flex flex-col sm:flex-row items-center bg-gray-50 p-4 rounded-xl hover:shadow-md transition-all duration-300 group"
                                        >
                                            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                                                <img
                                                    src={productImage}
                                                    alt={productName}
                                                    className="w-24 h-24 object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform mix-blend-multiply"
                                                />
                                            </div>
                                            <div className="flex-grow w-full">
                                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                                    <div className="mb-2 sm:mb-0">
                                                        <h3 className="text-lg font-bold text-gray-900">{productName}</h3>
                                                        <p className="text-sm text-gray-600 flex items-center gap-2">
                                                            <FaTag className="text-blue-500" />
                                                            {productsCategory}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-blue-700">{displayNGNCurrency(productPrice)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    <div className="flex items-center gap-3 bg-white rounded-full px-3 py-2 shadow-md">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(product.cartItemId, productQuantity - 1)}
                                                            disabled={productQuantity <= 1}
                                                            className="p-1 bg-blue-100 text-red-600 rounded-full disabled:opacity-50 hover:bg-blue-200 transition-colors"
                                                        >
                                                            <FaMinus className="text-sm" />
                                                        </button>
                                                        <span className="font-bold w-6 text-center">{productQuantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(product.cartItemId, productQuantity + 1)}
                                                            className="p-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                                                        >
                                                            <FaPlus className="text-sm" />
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold text-gray-700">
                                                            {displayNGNCurrency(productQuantity * productPrice)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleRemoveCart(product.cartItemId)}
                                                            className="text-red-500 hover:text-red-700 hover:scale-110 transition-transform"
                                                        >
                                                            <MdDelete className="text-2xl" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Checkout Section */}
                            <div className="mt-8 pt-6 border-t border-gray-200 ">
                                    <div className="text-blue-700 font-bold text-sm lg:text-lg flex justify-between ">
                                        <div><span className='text-red-600 text-lg'>Total:</span> {displayNGNCurrency(calculateTotal())}</div>
                                        <div className='lg:hidden block'>Quantity: {context?.cartCount}</div>
                                    </div>
                                <Link to={"/checkout"}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full 
                                               hover:scale-105 transition-transform 
                                               flex items-center justify-center gap-3 font-bold hover:text-white-300"
                                >
                                    <FaShoppingCart />
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Cart;