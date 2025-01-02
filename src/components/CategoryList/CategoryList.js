import React, { useEffect, useState } from 'react'
import { summaryApi } from '../../common'
import { Link } from 'react-router-dom'

function CategoryList() {

    const [categoryProduct, SetCategoryProduct] = useState([])
    const [loading, setLoading] = useState(false)


    const categoryLoading = new Array(13).fill(null)


    const fetchCategoryProduct = async () => {
        setLoading(true)
        const response = await fetch(summaryApi.categoryProduct.url, {
            method: summaryApi.categoryProduct.method,
            credentials: "include"
        })
        const responseData = await response.json()
        setLoading(false)
        SetCategoryProduct(responseData?.data || [])
    }

    useEffect(() => {
        fetchCategoryProduct()
    }, [])


    return (
        <div className='container mx-auto px-4 overflow-x-hidden mt-2'>
            <div className='flex items-center gap-4 overflow-x-auto scrollbar-none'>
                {
                    loading ? (
                        categoryLoading.map((item, index) => {
                            return (
                                <div
                                    key={"categoryLoading" + index}
                                    className="flex-shrink-0 h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gradient-to-r from-violet-500 to-blue-200 animate-pulse flex items-center justify-center"
                                >
                                    <p className='text-sm text-pink-300'></p>
                                </div>
                            )
                        })
                    ) : (
                        categoryProduct.map((product, index) => {
                            return (
                                <Link 
                                    to={"/product-category?category=" + product?.productsCategory} 
                                    key={index} 
                                    className='cursor-pointer flex-shrink-0'
                                >
                                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-4 bg-gradient-to-r from-violet-300 to-blue-200 flex items-center justify-center'>
                                        <img
                                            src={product?.productImage[0]}
                                            alt={product.productsCategory}
                                            className='h-full object-scale-down mix-blend-multiply hover:scale-125 transition-all'
                                        />
                                    </div>
                                    <div>
                                        <h2 className='text-center text-xs md:text-base capitalize'>{product?.productsCategory}</h2>
                                    </div>
                                </Link>
                            )
                        })
                    )
                }
            </div>
        </div>
    )
}

export default CategoryList