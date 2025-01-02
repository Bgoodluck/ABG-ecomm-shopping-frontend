import logo from './logo.svg';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { summaryApi } from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';

function App() {

  const dispatch = useDispatch()
  const [cartCount, setCartCount] = useState(0)



  const fetchUserDetails = async () => {

    const response = await fetch(summaryApi.current_user.url, {
      method: summaryApi.current_user.method,
      credentials: "include"
    });

    const responseData = await response.json();

    if (responseData.success) {
      dispatch(setUserDetails(responseData.data))
    }

    console.log("data-user", responseData)
  }



  const fetchUserAddToCart = async () => {
    try {
        const response = await fetch(summaryApi.cartCounter.url, {
            method: summaryApi.cartCounter.method,
            credentials: "include"
        });
        
        const responseData = await response.json();
        console.log("Cart Counter Full Response:", responseData);

        
        const cartCount = responseData?.data?.count || responseData?.count || 0;
        setCartCount(cartCount);

    } catch (error) {
        console.error("Cart Counter Error:", error);
        setCartCount(0);
    }
}

  useEffect(() => {
    /**user Details & cart count**/
    fetchUserDetails()
    fetchUserAddToCart()
  }, []);


  return (
    <>
      <Context.Provider value={{
        fetchUserDetails,
        cartCount,
        fetchUserAddToCart
      }}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Header />
        <main className='min-h-[calc(100vh-100px)] pt-16'>
          <Outlet />
        </main>
        <Footer />

      </Context.Provider>
    </>
  );
}

export default App;
