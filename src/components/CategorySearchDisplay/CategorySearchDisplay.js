
import React, { useContext, useEffect, useState } from 'react'
import fetchAllCategories from '../../helpers/fetchAllCategories';
import { displayNGNCurrency } from '../../helpers/displayCurrency';
import addToCart from '../../helpers/addToCart';
import { Link } from 'react-router-dom';
import Context from "../../context"

function CategorySearchDisplay({ productsCategory, heading }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { fetchUserAddToCart } = useContext(Context);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchAllCategories(productsCategory);

            if (response && response.data) {
                setData(response.data);
            } else {
                setError("No data found");
            }
        } catch (error) {
            console.error(error);
            setError(error.message || "An error occurred");
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [productsCategory])

    const handleAddToCart = (e, productId) => {
        addToCart(e, productId, fetchUserAddToCart);
    }

    const SkeletonLoader = () => {
        return Array(5).fill().map((_, index) => (
            <div 
                key={index} 
                className='w-full h-36 bg-slate-200 rounded-sm shadow-md flex animate-pulse'
            >
                <div className='bg-slate-300 h-full p-4 min-w-[120px] md:min-w-[145px] flex items-center justify-center'>
                    <div className='w-full h-full bg-slate-400 rounded'></div>
                </div>
                <div className='p-4 grid w-full'>
                    <div className='h-4 bg-slate-300 mb-2 w-3/4 rounded'></div>
                    <div className='h-3 bg-slate-300 mb-2 w-1/2 rounded'></div>
                    <div className='h-4 bg-slate-300 mb-2 w-2/3 rounded'></div>
                    <div className='h-8 bg-slate-300 w-1/2 rounded mt-2'></div>
                </div>
            </div>
        ));
    }

    return (
        <div className='container mx-auto px-4 my-6'>
            <h2 className='text-2xl font-bold mb-4 py-4'>{heading}</h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {loading ? (
                    <SkeletonLoader/>
                ) : (
                    data.length === 0 ? (
                        <div>No products found</div>
                    ) : (
                        data.map((product, index) => (
                            <Link 
                                to={"product/"+product?._id} 
                                key={product._id || index} 
                                className='w-full bg-slate-300 rounded-sm shadow-md flex flex-wrap mix-blend-multiply'
                            >
                                <div className='h-48 p-4 w-full flex justify-center items-center'>
                                    <img
                                        src={product.productImage[0]}
                                        alt={product.productName}
                                        className='w-full h-full object-scale-down hover:scale-110 transition-all mix-blend-multiply'
                                    />
                                </div>
                                <div className='p-4 grid gap-3'>
                                    <h2 className='text-base md:text-sm font-medium text-ellipsis line-clamp-1'>
                                        {product.productName}
                                    </h2>
                                    <p className='text-xs capitalize text-slate-500'>
                                        {product.productsCategory}
                                    </p>
                                    <div className='flex gap-2 flex-wrap items-center'>
                                        <span className='text-sm text-blue-500 font-medium'>
                                            {displayNGNCurrency(product.productPrice)}
                                        </span>
                                        <span className='text-sm text-red-500 line-through'>
                                            Discount: {displayNGNCurrency(product.productDiscount)}
                                        </span>
                                    </div>
                                    <button 
                                        onClick={(e) => handleAddToCart(e, product?._id)}
                                        className='p-2 text-sm mt-2 rounded-full text-white
                                        bg-gradient-to-r from-violet-600 to-blue-400
                                        transition-all duration-300 hover:shadow-lg hover:scale-105
                                        focus:outline-none focus:ring-2 focus:ring-violet-400'
                                    >
                                        Add to cart
                                    </button>
                                </div>
                            </Link>
                        ))
                    )
                )}
            </div>
        </div>
    )
}

export default CategorySearchDisplay;