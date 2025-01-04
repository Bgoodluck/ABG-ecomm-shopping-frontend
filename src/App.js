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
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not authenticated');
        return;
      }

      const response = await fetch(summaryApi.current_user.url, {
        method: summaryApi.current_user.method,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        dispatch(setUserDetails(responseData.data));
      } else {
        console.log('User details fetch failed:', responseData.message);
        // Handle failed auth - maybe clear token and redirect to login
        if (response.status === 401) {
          localStorage.removeItem('token');
          dispatch(setUserDetails(null));
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };




  const fetchUserAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setCartCount(0);
        return;
      }

      const response = await fetch(summaryApi.cartCounter.url, {
        method: summaryApi.cartCounter.method,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        const cartCount = responseData?.data?.count || responseData?.count || 0;
        setCartCount(cartCount);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
      setCartCount(0);
    }
  };


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
