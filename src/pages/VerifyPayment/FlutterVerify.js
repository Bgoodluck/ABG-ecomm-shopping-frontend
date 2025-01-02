import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { summaryApi } from '../../common';

function FlutterVerify() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const userData = useSelector((state) => state?.user?.user);
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')
    const transaction_id = searchParams.get('transaction_id')
    const tx_ref = searchParams.get('tx_ref')

    const verifyFlutterwave = async () => {
        try {
            const response = await fetch(summaryApi.flutterwaveVerify.url, {
                method: summaryApi.flutterwaveVerify.method,
                credentials: 'include', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId,
                    success,
                    userId: userData?._id,
                    transaction_id,  
                    tx_ref  
                })
            })
            
            const responseData = await response.json(); 
            
            if (responseData.success) {
                toast.success('Payment successful')
                navigate(responseData.redirectUrl || '/orders')
            } else {
                toast.error(responseData.message || 'Payment verification failed')
                navigate(responseData.redirectUrl || '/cart')
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message || 'Payment verification failed')
            navigate('/cart')
        }
    }

    useEffect(() => {
        if (orderId && success) {
            verifyFlutterwave()
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

export default FlutterVerify