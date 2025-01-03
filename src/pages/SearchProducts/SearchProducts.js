
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

