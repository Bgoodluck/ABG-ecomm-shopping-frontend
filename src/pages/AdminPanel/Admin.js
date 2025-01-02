import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ROLE } from '../../common/role';



function Admin() {
    const user = useSelector((state) => state?.user?.user);
    const navigate = useNavigate()


    useEffect(()=>{

        if(user?.role !== ROLE.ADMIN){
            navigate("/")
        }
    },[user])

    const profilePicUrl = user?.profilePic 
  ? `${process.env.REACT_APP_BACKEND_URL}/${user.profilePic.replace(/\\/g, '/')}` 
  : null;



  return (
    <div className="min-h-[calc(100vh-120px)] bg-gradient-to-r from-violet-500 to-pink-500 md:flex hidden">
      <aside className="bg-white-500 min-h-full w-full max-w-60 customShadow">
        <div className='h-42 flex justify-center align-center flex-col pt-6 bg-gradient-to-r from-violet-600 to-pink-600'>
          <div className="relative group flex justify-center">
            <button className="relative p-2">
              {user?.profilePic ? (
                <div className="w-20 h-20 rounded-full overflow-hidden ">
                  <img
                    src={profilePicUrl}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <FaRegCircleUser className="text-2xl text-slate-600 transition-colors duration-300 group-hover:text-violet-600" />
              )}
              <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300 group-hover:w-full group-hover:left-0" />
            </button>
          </div>
          <b className='text-center capitalize'>
            {user?.firstName} {user?.lastName}
            <br />
            {user?.role}
          </b>
        </div>
        <div>
            <nav className='grid p-4'>
                <Link to={"all-users"} className='px-2 py-1 hover:bg-gradient-to-r from-pink-200 to-violet-200'>All Users</Link>
                <Link to={"all-products"} className='px-2 py-1 hover:bg-gradient-to-r from-pink-200 to-violet-200'>All Products</Link>
                <Link to={"order-inventory"} className='px-2 py-1 hover:bg-gradient-to-r from-pink-200 to-violet-200'>Order Inventory</Link>
                <Link to={"newsletter-admin"} className='px-2 py-1 hover:bg-gradient-to-r from-pink-200 to-violet-200'>Newsletters</Link>
            </nav>
        </div>
      </aside>

      <main className='w-full h-full p-2'>
          <Outlet/>
      </main>
    </div>
  );
}

export default Admin