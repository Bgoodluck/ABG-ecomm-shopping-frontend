import React, { useContext, useEffect, useRef, useState } from 'react'
import fetchAllCategories from '../../helpers/fetchAllCategories';
import { displayNGNCurrency } from '../../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import addToCart from '../../helpers/addToCart';
import { Link } from 'react-router-dom';
import Context from "../../context"

function VerticalCardProduct({ productsCategory, heading }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scroll, setScroll] = useState(0)

    const { fetchUserAddToCart } = useContext(Context);
    const scrollElement = useRef()



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

    const scrollRight = ()=>{
        if (scrollElement.current) {
            const newScrollPosition = scroll + 300;
            scrollElement.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth"
            })
            setScroll(newScrollPosition)
        }
    }

    const scrollLeft = ()=>{
        if (scrollElement.current) {
            const newScrollPosition = scroll - 300;
            scrollElement.current.scrollTo({
                left: newScrollPosition,
                behavior: "smooth"
            })
            setScroll(newScrollPosition)
        }
    }


    const handleAddToCart = (e, productId) => {
        addToCart(e, productId, fetchUserAddToCart);
    }


    const SkeletonLoader = () => {
        return Array(5).fill().map((_, index) => (
            <div 
                key={index} 
                className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320x] h-36 bg-slate-200 rounded-sm shadow-md flex animate-pulse'
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
        <div className='container mx-auto px-4 my-6 relative'>
            <h2 className='text-2xl font-bold mb-4 py-4'>{heading}</h2>
            <div className='relative'>
                <div 
                    className='flex items-center gap-4 md:gap-6 overflow-x-scroll scrollbar-none transition-all' 
                    ref={scrollElement}
                >
                    {
                    loading ? (
                        <SkeletonLoader/>
                    ) : (
                        data.length === 0 ? (
                            <div>No products found</div>
                        ) : (
                            data.map((product, index) => (
                                <Link to={"product/"+product?._id} 
                                    key={product._id || index} 
                                    className='w-full min-w-[280px] md:min-w-[320px] max-w-[280px] md:max-w-[320x] bg-slate-300 rounded-sm shadow-md'
                                >
                                    <div className='bg-white-300 h-48 p-4 min-w-[280px] md:min-w-[145px] flex justify-center items-center'>
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

                    )
                    }
                </div>

                <button 
                    className='bg-white shadow-md rounded-full p-1 absolute left-0 top-1/2 -translate-y-1/2 text-lg hidden md:block transition-all' 
                    onClick={scrollLeft}
                >
                    <FaAngleLeft />
                </button>
                <button 
                    className='bg-white shadow-md rounded-full p-1 absolute right-0 top-1/2 -translate-y-1/2 text-lg hidden md:block transition-all' 
                    onClick={scrollRight}
                >
                    <FaAngleRight />
                </button>
            </div>
        </div>
    )
}

export default VerticalCardProduct;