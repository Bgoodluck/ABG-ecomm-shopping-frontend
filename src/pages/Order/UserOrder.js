import React, { useContext, useEffect, useState } from 'react'
import Context from '../../context'
import { useSelector } from 'react-redux'
import { displayNGNCurrency } from '../../helpers/displayCurrency'
import { summaryApi } from '../../common'
import { toast } from 'react-toastify'

function UserOrder() {
    const userData = useSelector((state) => state?.user?.user)
    const [orderData, setOrderData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    



    const loadOrderData = async () => {
        try {
            if (!userData?._id) {
                toast.error('Please log in to view your orders')
                setLoading(false)
                return
            }
    
            const response = await fetch(summaryApi.orderHistory.url, {
                method: 'POST', 
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ userId: userData._id }) 
            })
    
            const responseData = await response.json()

            console.log("bisibisi", responseData)

            if (responseData.success) {
                // Flatten the orders to display individual items
                let allOrdersItem = []
                responseData.orders.forEach((order) => {
                    order.items.forEach((item) => {
                        allOrdersItem.push({
                            ...item,
                            status: order.status,
                            payment: order.payment,
                            paymentMethod: order.paymentMethod,
                            date: order.date,
                            orderId: order._id
                        })
                    })
                })
                
                // Sort orders by date, most recent first
                allOrdersItem.sort((a, b) => new Date(b.date) - new Date(a.date))
                
                setOrderData(allOrdersItem)
                console.log("POLPO", allOrdersItem)
                setLoading(false)
            } else {
                toast.error(responseData.message || 'Failed to load orders')
                setLoading(false)
            }
        } catch (error) {
            console.error('Error loading orders:', error)
            toast.error('An error occurred while fetching orders')
            setError(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        loadOrderData()
    }, [userData?._id])

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-yellow-500'
            case 'processing': return 'bg-blue-500'
            case 'shipped': return 'bg-green-500'
            case 'delivered': return 'bg-green-700'
            case 'cancelled': return 'bg-red-500'
            default: return 'bg-slate-500'
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>Loading your orders...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center text-red-600">
                <p>Error loading orders. Please try again later.</p>
            </div>
        )
    }

    if (orderData.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p>No orders found.</p>
            </div>
        )
    }

    return (
        <div className='container mx-auto px-4 py-8 border-t'>
            <h2 className='text-2xl font-bold mb-6'>Your Orders</h2>

            <div>
                {orderData.map((item, index) => (
                    <div 
                        key={`${item.orderId}-${index}`} 
                        className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
                    >
                        <div className='flex items-start gap-6 text-sm'>
                            <img 
                                src={item?.image} 
                                className='w-16 sm:w-20 object-cover rounded-md' 
                                alt={item.name} 
                            />
                            <div>
                                <p className='sm:text-base font-medium'>{item?.name}</p>
                                <div className='flex flex-wrap items-center gap-3 mt-1 text-base text-gray-700'>
                                    <p className='text-lg'>{displayNGNCurrency(item?.price)}</p>                                                             
                                    
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Subtotal: {displayNGNCurrency(item.quantity * item.price)}</p>
                                </div>
                                <p className='mt-1'>
                                    Date: <span className='text-[#fd3da1]'>
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </p>
                                <p className='mt-1'>
                                    Payment: <span className='text-[#fd3da1]'>{item.paymentMethod}</span>
                                </p>
                            </div>
                        </div>
                        <div className='md:w-1/2 flex justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <p className={`min-w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></p>
                                <p className='text-sm md:text-base capitalize'>{item.status}</p>
                            </div>
                            <button 
                                className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100'
                            >
                                Track Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserOrder