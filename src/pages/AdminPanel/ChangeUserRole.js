import React, { useState } from 'react'
import { ROLE } from '../../common/role'
import { IoCloseCircleOutline } from "react-icons/io5";
import { summaryApi } from '../../common';
import { toast } from 'react-toastify';

function ChangeUserRole({firstName, lastName, email, role, userId, onClose, fetchAllUsers}) {

  const [userRole, setUserRole] = useState(role)


  const handleOnChangeSelect = async(e)=>{
    setUserRole(e.target.value)
    // Save user role to the backend here if needed
    console.log("roleMange",e.target.value)
  }

  const updateUserRole = async()=>{

    const response = await fetch(summaryApi.updateUser.url,{
      method: summaryApi.updateUser.method,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        role: userRole
      })
    })

    const responseData = await response.json();
    console.log("updateUser", responseData)
    
      if (responseData.success) {
        toast.success(responseData.message || "Role updated successfully"); 
        await fetchAllUsers();   
        onClose();        
      }

      if (responseData.error) {
        toast.error(responseData.message || "Failed to update role");
        
      
    }
  }


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-pink-200 bg-opacity-50">
      <div className="mx-auto bg-gradient-to-r from-violet-300 to-pink-300 shadow-md p-4 w-full max-w-sm">
        <button 
          onClick={onClose}
          className='block ml-auto bg-gradient-to-r from-violet-600 to-pink-600 rounded-full text-white-500 hover:text-black-900' 
          >
          <IoCloseCircleOutline/>
        </button>
        <h1 className="pb-4 text-lg font-medium underline text-gray-900">
          Change User Role
        </h1>
        <p>Name: {firstName} {lastName}</p>
        <p>Email: {email}</p>

        <div className='flex items-center justify-between my-4'>
          <p>Role :</p>
          <select 
             value={userRole} 
             onChange={handleOnChangeSelect}
             className="bg-gradient-to-r from-violet-200 to-pink-200 border px-4 py-1">
            {Object.values(ROLE).map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <button 
          onClick={updateUserRole}
          className='w-fit mx-auto block py-1 px-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300 hover:text-white-300 hover:w-full hover:left-0'>Change Role</button>
      </div>
    </div>
  );
}

export default ChangeUserRole