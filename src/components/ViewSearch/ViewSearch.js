// import React, { useContext } from 'react'
// import { displayNGNCurrency } from '../../helpers/displayCurrency';
// import Context from '../../context';
// import addToCart from '../../helpers/addToCart';


// function ViewSearch({ product }) { 

//     const {fetchUserDetails, fetchUserAddToCart} = useContext(Context)


//     const handleAddToCart = (e, productId) => {
//         addToCart(e, productId, fetchUserAddToCart);
//     }


//     console.log("popo", product)


//     return(
//     <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
//       <img 
//         src={product.productImage[0]} 
//         alt={product.productName} 
//         className="w-full h-48 object-fit rounded-t-lg mix-blend-multiply"
//       />
//       <div className="mt-4">
//         <h3 className="text-lg font-semibold text-gray-800">{product.productName}{""}</h3>
//         <div className='flex justify-between m-2'>
//         <p className="text-sm text-violet-600">{product.productsCategory}</p>
//         <p className="text-sm text-blue-600">{product.productBrand}</p>
//         </div>
//         <p className="text-gray-600 mt-2">{product.productDescription}</p>
//         <div className="flex justify-between items-center mt-4">
//           <span className="text-xl font-bold text-blue-600">{displayNGNCurrency(product.productPrice)}</span>
//           <button
//             onClick={(e) => handleAddToCart(e, product?._id)} 
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// };
  

// export default ViewSearch


import React, { useContext } from 'react'
import { displayNGNCurrency } from '../../helpers/displayCurrency';
import Context from '../../context';
import addToCart from '../../helpers/addToCart';

function ViewSearch({ data }) {  // Change from product to data
    const {fetchUserDetails, fetchUserAddToCart} = useContext(Context)

    const handleAddToCart = (e, productId) => {
        addToCart(e, productId, fetchUserAddToCart);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data && data.map((product) => (  // Add mapping over the data array
                <div 
                    key={product._id} 
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
                >
                    <img 
                        src={product.productImage[0]} 
                        alt={product.productName} 
                        className="w-full h-48 object-fit rounded-t-lg mix-blend-multiply"
                    />
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
                        <div className='flex justify-between m-2'>
                            <p className="text-sm text-violet-600">{product.productsCategory}</p>
                            <p className="text-sm text-blue-600">{product.productBrand}</p>
                        </div>
                        <p className="text-gray-600 mt-2">{product.productDescription}</p>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-blue-600">
                                {displayNGNCurrency(product.productPrice)}
                            </span>
                            <button
                                onClick={(e) => handleAddToCart(e, product?._id)} 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ViewSearch


// import React, { useContext } from 'react'
// import { displayNGNCurrency } from '../../helpers/displayCurrency';
// import Context from '../../context';
// import addToCart from '../../helpers/addToCart';

// function ViewSearch({ data }) {
//     const { fetchUserDetails, fetchUserAddToCart } = useContext(Context)

//     const handleAddToCart = (e, productId) => {
//         addToCart(e, productId, fetchUserAddToCart);
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {data && data.map((product) => (
//                     <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//                         <div className="w-full h-48 object-fit rounded-t-lg mix-blend-multiply">
//                             <img src={product.productImage[0]} alt={product.productName} className="w-full h-full object-cover rounded-t-lg mix-blend-multiply" />
//                         </div>
//                         <div className="p-4">
//                             <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.productName}</h3>
//                             <div className="flex justify-between mb-2">
//                                 <p className="text-sm text-violet-600">{product.productsCategory}</p>
//                                 <p className="text-sm text-blue-600">{product.productBrand}</p>
//                             </div>
//                             <p className="text-gray-600 mb-4">{product.productDescription}</p>
//                             <div className="flex justify-between items-center">
//                                 <span className="text-xl font-bold text-blue-600">
//                                     {displayNGNCurrency(product.productPrice)}
//                                 </span>
//                                 <button
//                                     onClick={(e) => handleAddToCart(e, product?._id)}
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
//                                 >
//                                     Add to Cart
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default ViewSearch