import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { FaBoxOpen } from "react-icons/fa";
import { displayNGNCurrency } from '../../helpers/displayCurrency'
import { summaryApi } from '../../common'



function OrderInventory() {

  const [orders, setOrders] = useState([]);





  const fetchAllOrders = async () => {
    try {
      const response = await fetch(summaryApi.AdminOrderInventory.url, {
        method: summaryApi.AdminOrderInventory.method,
        credentials: "include"
      });
      
      const data = await response.json();
      console.log("Orders data:", data)
      if (data.success) {
        const ordersWithUserDetails = await Promise.all(
          data.orders.reverse().map(async (order) => {
            console.log("Processing order userId:", order.userId)
            try {
              const userDetailsUrl = `${summaryApi.getUserDetailsId.url}/${order.userId}`;
              console.log("Fetching user details from URL:", userDetailsUrl);
              
              const userResponse = await fetch(userDetailsUrl, {
                method: 'GET',  
                credentials: "include"
              });
              
              console.log("User response status:", userResponse.status);
              
              if (!userResponse.ok) {
                const errorText = await userResponse.text();
                console.error('User fetch failed:', errorText);
                return order;
              }
              
              const userData = await userResponse.json();
              console.log("User data received:", userData);
              
              return {
                ...order,
                userFirstName: userData.firstName,
                userLastName: userData.lastName
              };
            } catch (userError) {
              console.error('Error fetching user details:', userError);
              return order;
            }
          })
        );
    
        setOrders(ordersWithUserDetails);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await fetch(summaryApi.OrderStatus.url, {
        method: summaryApi.OrderStatus.method,
        credentials: "include",
        headers: {              
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, status: event.target.value })
      });
      
      const data = await response.json(); 
      
      if (data.success) {
        toast.success(data.message);
        await fetchAllOrders();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }


  useEffect(() => {
    fetchAllOrders();
  }, [])



  return (
    <div>
      <h3 className='text-slate-950'>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className=' grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-sm sm:text-sm text-gray-700' key={index}>
              <p className=' w-12 text-white-500 font-bold text-xl lg:text-2xl' ><FaBoxOpen/></p>
              <div>
                <div>
                  {
                    order.items.map((item, index) => {
                      if (index === order.items.length - 1) {
                        return <p className='py-0.5 text-black-900' key={index}>{item.name} x {item.quantity} </p>
                      }
                      else {
                        return <p className='py-0.5 text-black-900' key={index}>{item.name} x {item.quantity} , </p>
                      }
                    })
                  }
                </div>
                <p className=' mt-3 mb-2 font-semibold text-white-500'>{order.userFirstName + " " + order.userLastName}</p>
                <div>
                  <p className='text-black-900'>{order.address.street + ","}</p>
                  <p className='text-black-900'>{order.address.city + ", " + order.address.state + ", " + order.address.country }</p>
                </div>
                <p className='text-blue-900'>Landmark: {" " + order.address.landmark}</p>
                <p className='text-black-900'>{order.address.phoneNumber}</p>
              </div>
              <div>
                <p className=' text-sm sm:text-[15px] text-black-900'>Items : {order.items.length}</p>
                <p className=' mt-3 text-black-900'>Method : {order.paymentMethod}</p>
                <p className='text-black-900'>payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p className='text-white-500'>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className=' text-sm sm:text-[15px] text-black-900'>{displayNGNCurrency(order.amount)}:00</p>
              <select onChange={(event)=> statusHandler(event,order._id)} value={order.status} className=' p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default OrderInventory