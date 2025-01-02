import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaShoppingCart, FaUser, FaEnvelope, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa'
import { displayNGNCurrency } from '../../helpers/displayCurrency'
import Context from '../../context'
import { useSelector } from 'react-redux'
import { summaryApi } from '../../common'
import { toast } from 'react-toastify'



function Checkout() {
    const navigate = useNavigate()
    const context = useContext(Context)
    const userData = useSelector((state) => state?.user?.user);
    
    const [cartData, setCartData] = useState([])
    const [loading, setLoading] = useState(true)
    const [shippingAddress, setShippingAddress] = useState({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        phoneNumber: '',
        landmark: ''
    })

    const [paymentMethod, setPaymentMethod] = useState('')



    // Fetch cart data
    const fetchCartData = async () => {
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

                setCartData(cartData);
            }
            setLoading(false)
        } catch (error) {
            console.error('Error fetching cart data:', error);
            setLoading(false)
        }
    }

    // Calculating the total and adding the delivery fee
    const calculateTotal = () => {
        const delivery_fee = 100 
        return cartData.reduce((total, product) => {
            const price = product.productPrice || product.price || 0;
            const quantity = product.quantity || 1;
            return total + (quantity * price);
        }, 0) + delivery_fee
    }

    // Handle address input
    const handleAddressChange = (e) => {
        const { name, value } = e.target
        setShippingAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Payment method handlers
    const handlePaymentMethod = async (method) => {        

        if (!userData?._id) {
            toast.error('User not logged in')
            return
        }

        const requiredFields = ['street', 'city', 'state', 'postalCode', 'phoneNumber']
        const missingFields = requiredFields.filter(field => !shippingAddress[field])
        
        if (missingFields.length > 0) {
            toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`)
            return
        }


        setPaymentMethod(method)

        // Prepare order items (similar to your original code)
        const orderItems = cartData.map(product => ({
            productId: product._id,
            name: product.productName,
            description: product.productDescription,
            image: product.productImage[0],            
            quantity: product.quantity,
            price: product.productPrice,
            size: product.size || 'default'
        }))

        // Prepare complete order data
        const orderData = {
            userId: userData?._id, // Explicitly add userId from Redux
            address: {
                street: shippingAddress.street,
                city: shippingAddress.city,
                state: shippingAddress.state,
                postalCode: shippingAddress.postalCode,
                phoneNumber: shippingAddress.phoneNumber,
                landmark: shippingAddress.landmark,
                country: shippingAddress.country || 'Nigeria'
            },
            email: userData?.email,
            items: orderItems,
            amount: calculateTotal(),
            paymentMethod: method
        }


        // Prepare flutter-specific data
        const flutterData = {
            ...orderData,
            email: userData.email,
            phone: shippingAddress.phoneNumber,
            userId: {
                firstName: userData.firstName,
                lastName: userData.lastName,
                _id: userData._id
            }
        }


        try {
            const token = localStorage.getItem('token') // Assuming you store token in localStorage
            // const backendUrl = process.env.REACT_APP_BACKEND_URL // Assuming you have backend URL in env

            switch (method) {
                case 'cod':
                    const codResponse = await fetch(summaryApi.cod.url, {
                        method: summaryApi.cod.method,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'token': token
                        },
                        body: JSON.stringify(orderData)
                    })
                    const codResult = await codResponse.json()

                    if (codResult.success) {
                        toast.success('Order placed successfully')
                        navigate('/orders')
                    } else {
                        toast.error(codResult.message)
                    }
                    break

                case 'stripe':
                    const stripeResponse = await fetch(summaryApi.stripe.url, {
                        method: summaryApi.stripe.method,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'token': token
                        },
                        body: JSON.stringify(orderData)
                    })
                    const stripeResult = await stripeResponse.json()

                    if (stripeResult.success) {
                        window.location.replace(stripeResult.session_url)
                    } else {
                        toast.error(stripeResult.message)
                    }
                    break

                case 'flutterwave':
                    const flwResponse = await fetch(summaryApi.flutterwave.url, {
                        method: summaryApi.flutterwave.method,
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                           
                        },
                        body: JSON.stringify(flutterData)
                    })
                    const flwResult = await flwResponse.json()

                    if (flwResult.success) {
                        toast.success('Redirecting to payment...')
                        setTimeout(() => {
                            window.location.href = flwResult.data.link
                        }, 1000)
                    } else {
                        toast.error(flwResult.message || 'Failed to initiate payment')
                    }
                    break

                default:
                    toast.error('Invalid payment method')
                    break
            }
        } catch (error) {
            console.error('Payment error:', error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchCartData()
    }, [])

    // Validate address form
    const isAddressValid = () => {
        return shippingAddress.street && 
               shippingAddress.city && 
               shippingAddress.state && 
               shippingAddress.postalCode &&
               shippingAddress.phoneNumber && 
               shippingAddress.landmark
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
                {/* Order Summary */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
                        <FaShoppingCart className="text-blue-600" /> Order Summary
                    </h2>
                    
                    {/* Cart Items */}
                    <div className="space-y-4 mb-6">
                        {cartData.map((product) => (
                            <div 
                                key={product._id} 
                                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <img 
                                        src={product.productImage?.[0]} 
                                        alt={product.productName} 
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    <div>
                                        <h3 className="font-bold">{product.productName}</h3>
                                        <p className="text-gray-600">Qty: {product.quantity}</p>
                                    </div>
                                </div>
                                <span className="font-bold">
                                    {displayNGNCurrency(product.productPrice * product.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="text-right">
                        <h3 className="text-xl font-bold">
                            Total: {displayNGNCurrency(calculateTotal())}
                        </h3>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Customer Details</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                            <FaUser className="text-blue-600" />
                            <div>
                                <h4 className="font-bold">Name</h4>
                                <p>{userData?.firstName || 'N/A'}{" "}{userData?.lastName || 'N/A'}</p>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
                            <FaEnvelope className="text-blue-600" />
                            <div>
                                <h4 className="font-bold">Email</h4>
                                <p>{userData?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping Address</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <input 
                            type="text"
                            name="street"
                            placeholder="Street Address"
                            value={shippingAddress.street}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text"
                            name="city"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text"
                            name="state"
                            placeholder="State"
                            value={shippingAddress.state}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text"
                            name="postalCode"
                            placeholder="Postal Code"
                            value={shippingAddress.postalCode}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={shippingAddress.phoneNumber}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="text"
                            name="landmark"
                            placeholder="Nearest Landmark"
                            value={shippingAddress.landmark}
                            onChange={handleAddressChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Payment Methods */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Payment Method</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => handlePaymentMethod('flutterwave')}
                            // disabled={!isAddressValid()}
                            className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 
                                       flex items-center justify-center gap-3 
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-colors"
                        >
                            <FaCreditCard /> Flutterwave
                        </button>
                        
                        <button 
                            onClick={() => handlePaymentMethod('stripe')}
                            // disabled={!isAddressValid()}
                            className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 
                                       flex items-center justify-center gap-3 
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-colors"
                        >
                            <FaCreditCard /> Stripe
                        </button>
                        
                        <button 
                            onClick={() => handlePaymentMethod('cod')}
                            // disabled={!isAddressValid()}
                            className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 
                                       flex items-center justify-center gap-3 
                                       disabled:opacity-50 disabled:cursor-not-allowed
                                       transition-colors"
                        >
                            <FaShoppingCart /> Cash on Delivery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout