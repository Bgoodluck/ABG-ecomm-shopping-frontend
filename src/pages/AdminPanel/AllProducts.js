import React, { useEffect, useState } from 'react'
import UploadProducts from './UploadProducts'
import { summaryApi } from '../../common';
import ProductCard from './ProductCard';

function AllProducts() {

  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]); 



  const fetchAllProducts = async()=>{
    const response = await fetch(summaryApi.allProducts.url,{
      method: summaryApi.allProducts.method,
      credentials: "include"
    })
    const responseData = await response.json();

    setAllProducts(responseData?.data || []);
    console.log("allProducts", responseData)
  }

  useEffect(()=>{
    fetchAllProducts()
  }, [])


  return (
    <div>
        <div className='bg-black-500 py-2 px-4 flex justify-between items-center'>
           <h2 className='font-bold text-lg text-white-500'>
              All Products
           </h2>
           <button 
              onClick={() => setOpenUploadProduct(true)}
              className='border-2 py-1 px-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white-500 hover:text-black-900'>
              Upload Products
           </button>
        </div>


            {/* All products component */}
         <div className='flex items-center flex-wrap gap-5 py-4 h-[calc(100vh-190px)] overflow-y-scroll'>
            {
              allProducts.map((item, index)=>{
                return (
                  <ProductCard
                    fetchData={fetchAllProducts}
                    data={item}
                    key={index + "allProduct"}
                  />
                  
                )
              })
            }           
         </div>


        {/* upload product component in my pages folder */}
        {
          openUploadProduct && (
            <UploadProducts
              onClose={() => setOpenUploadProduct(false)}
              fetchData={fetchAllProducts}
            />
          )
        }
        
    </div>
  )
}

export default AllProducts