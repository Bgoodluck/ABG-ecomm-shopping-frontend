// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { summaryApi } from '../../common';
// import { displayNGNCurrency } from '../../helpers/displayCurrency';
// import ViewSearch from '../../components/ViewSearch/ViewSearch';

// // const ProductCard = ({ product }) => (
// //   <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
// //     <img 
// //       src={product.productImage[0]} 
// //       alt={product.productName} 
// //       className="w-full h-48 object-fit rounded-t-lg mix-blend-multiply"
// //     />
// //     <div className="mt-4">
// //       <h3 className="text-lg font-semibold text-gray-800">{product.productName}</h3>
// //       <p className="text-gray-600 mt-2">{product.productDescription}</p>
// //       <div className="flex justify-between items-center mt-4">
// //         <span className="text-xl font-bold text-blue-600">{displayNGNCurrency(product.productPrice)}</span>
// //         <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
// //           Add to Cart
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// // );

// const SearchProducts = () => {
//   const location = useLocation();
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const searchQuery = new URLSearchParams(location.search).get('q');

//   const fetchProducts = async () => {
//     if (!searchQuery) return;

//     setIsLoading(true);
//     try {
//       const response = await fetch(`${summaryApi.searchProducts.url}?q=${searchQuery}`);
//       const data = await response.json();
//       console.log("bissy", data)
//       setProducts(data?.data || []);
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [searchQuery]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">
//         Search Results for "{searchQuery}" ({products.length} items)
//       </h2>

//       {products.length === 0 ? (
//         <div className="text-center py-10 bg-gray-100 rounded-lg">
//           <p className="text-xl text-gray-600">No products found</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product, index) => (
//             <ViewSearch key={product.id || index} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchProducts;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { summaryApi } from '../../common';
import ViewSearch from '../../components/ViewSearch/ViewSearch';

const SearchProducts = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 
  const searchQuery = new URLSearchParams(location.search).get('q') || '';

  const fetchProducts = async () => {
    
    if (!searchQuery.trim()) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${summaryApi.searchProducts.url}?q=${searchQuery}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.data || []);
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('An error occurred while searching products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    
    if (searchQuery.trim()) {
      fetchProducts();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

 
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {searchQuery && (
        <h2 className="text-2xl font-bold mb-6">
          Search Results for "{searchQuery}" ({products.length} items)
        </h2>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-xl text-gray-600">
            {searchQuery 
              ? "No products found" 
              : "Enter a search term to find products"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {products.map((product) => (
            <ViewSearch 
              key={product._id || Math.random().toString()} 
              data={products} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { summaryApi } from '../../common';
// import ViewSearch from '../../components/ViewSearch/ViewSearch';

// const SearchProducts = () => {
//   const location = useLocation();
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Memoize search query to prevent unnecessary re-renders
//   const searchQuery = new URLSearchParams(location.search).get('q') || '';

//   const fetchProducts = async () => {
//     // Early return if no search query
//     if (!searchQuery.trim()) {
//       setProducts([]);
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${summaryApi.searchProducts.url}?q=${searchQuery}`);
//       const data = await response.json();

//       if (data.success) {
//         setProducts(data.data || []);
//       } else {
//         setError(data.message || 'Failed to fetch products');
//       }
//     } catch (error) {
//       console.error('Failed to fetch products:', error);
//       setError('An error occurred while searching products');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Only fetch if there's a non-empty search query
//     if (searchQuery.trim()) {
//       fetchProducts();
//     } else {
//       setProducts([]);
//     }
//   }, [searchQuery]);

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="container mx-auto p-4 text-center">
//         <p className="text-red-500 text-xl">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       {searchQuery && (
//         <h2 className="text-2xl font-bold mb-6">
//           Search Results for "{searchQuery}" ({products.length} items)
//         </h2>
//       )}

//       {products.length === 0 ? (
//         <div className="text-center py-10 bg-gray-100 rounded-lg">
//           <p className="text-xl text-gray-600">
//             {searchQuery 
//               ? "No products found" 
//               : "Enter a search term to find products"}
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ViewSearch 
//               key={product._id || Math.random().toString()} 
//               data={product} 
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchProducts;