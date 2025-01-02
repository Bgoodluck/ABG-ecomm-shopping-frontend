import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Context from '../../context';
import { summaryApi } from '../../common';

function StripeVerify() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const context = useContext(Context)
    const userData = useSelector((state) => state?.user?.user);
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')

    const verifyPayment = async () => {
        try {
            const response = await fetch(summaryApi.stripeVerify.url, {
                method: summaryApi.stripeVerify.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    success,
                    userId: userData?._id
                })
            })
            
            const responseData = await response.json();
            
            if (responseData.success) {
                context.fetchUserAddToCart([])
                navigate('/orders')
                toast.success('Payment successful')
            } else {
                toast.error(responseData.message || 'Payment verification failed')
                navigate('/cart')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
            navigate('/cart')
        }
    }

    useEffect(() => {
        if (orderId && success) {
            verifyPayment()
        }
    }, [orderId, success])

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center">
                <p className="text-xl">Verifying payment...</p>
            </div>
        </div>
    )
}

export default StripeVerify