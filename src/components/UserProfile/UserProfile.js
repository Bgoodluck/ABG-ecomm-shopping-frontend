import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { summaryApi } from '../../common';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../../store/userSlice';

const UserProfile = ({ onClose, userId }) => {
   const navigate = useNavigate();
   const [profile, setProfile] = useState(null);
   const [loading, setLoading] = useState(true);
   const [profileImage, setProfileImage] = useState(null);
   const [previewImage, setPreviewImage] = useState(null);
   const [formData, setFormData] = useState({
       address: '',
       phone: ''
   });
   const [errors, setErrors] = useState({});    
   const dispatch = useDispatch()
   const user = useSelector((state) => state.user.user);

   useEffect(() => {
       const fetchProfile = async () => {
           if (userId) {
               try {
                const token = localStorage.getItem('token');
                   const response = await fetch(`${summaryApi.getProfileDetails.url}/${userId}`, {
                       method: summaryApi.getProfileDetails.method,
                       credentials: "include",
                       headers: {
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json'
                       }
                   });
   
                   const data = await response.json();
                   if (data.success) {
                       setProfile(data.data);
                       toast.success(data.message || "Profile Fetched successfully");
                       setPreviewImage(data.data.profilePic ? `/uploads/${data.data.profilePic}` : null);
                       setFormData({
                           address: data.data.address || '',
                           phone: data.data.phone || ''
                       });
                   } else {
                       console.error('Failed to fetch profile');
                   }
               } catch (error) {
                   console.error('Error fetching profile:', error);
               } finally {
                   setLoading(false);
               }
           }
       };

       fetchProfile();
   }, [userId]);

   const validateForm = () => {
       const newErrors = {};

       if (!formData.address) {
           newErrors.address = 'Address is required';
       } else if (formData.address.length > 200) {
           newErrors.address = 'Address must be less than 200 characters';
       }

       const phoneRegex = /^[0-9]{1,16}$/;
       if (!formData.phone) {
           newErrors.phone = 'Phone number is required';
       } else if (!phoneRegex.test(formData.phone)) {
           newErrors.phone = 'Phone number must be between 10 and 16 digits';
       }

       setErrors(newErrors);
       return Object.keys(newErrors).length === 0;
   };

   const handleSubmit = async (e) => {
       e.preventDefault();
       
       if (!validateForm()) return;

       const submitFormData = new FormData();

       submitFormData.append('userId', userId);
       submitFormData.append('address', formData.address);
       submitFormData.append('phone', formData.phone);

       if (profileImage) {
           submitFormData.append('profilePic', profileImage);
       }

       try {
           const response = await fetch(`${summaryApi.updateProfileDetails.url}/${userId}`, {
               method: summaryApi.updateProfileDetails.method,
               credentials: "include",
               body: submitFormData
           });

           const result = await response.json();

           if (result.success) {
               const normalizedProfilePic = result.data.profilePic 
               ? result.data.profilePic.replace(/\\/g, '/') 
               : null;

               dispatch(setUserDetails({
                   ...user,  
                   profilePic: normalizedProfilePic,  
                   address: result.data.address,
                   phone: result.data.phone  
               }));
               toast.success(result.message || "Profile update successful");
               onClose(); 
               navigate("/")
           } else {
               console.error('Update failed');
           }
       } catch (error) {
           console.error('Profile update failed', error);
       }
   };

   const handleInputChange = (e) => {
       const { name, value } = e.target;
       setFormData(prev => ({
           ...prev,
           [name]: value
       }));
   };

   const handleImageChange = (event) => {
       const file = event.target.files[0];
       if (file) {
           setProfileImage(file);
           
           const reader = new FileReader();
           reader.onloadend = () => {
               setPreviewImage(reader.result);
           };
           reader.readAsDataURL(file);
       }
   };

   if (loading) return <div className="text-center p-4 text-lg">Loading...</div>;
   if (!profile) return <div className="text-center p-4 text-lg">No profile found</div>;

   return (
       <div className="container mx-auto px-4 py-6 max-w-2xl">
           <div className="max-h-[600px] overflow-y-auto scrollbar-none space-y-4">
               <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">User Profile</h2>
               
               <form onSubmit={handleSubmit} className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                           <label className="block text-sm font-medium mb-2">First Name</label>
                           <input 
                               type="text" 
                               value={profile?.firstName || ''} 
                               className="w-full px-3 py-2 border rounded-md bg-gray-100" 
                               disabled 
                           />
                       </div>

                       <div>
                           <label className="block text-sm font-medium mb-2">Last Name</label>
                           <input 
                               type="text" 
                               value={profile?.lastName || ''} 
                               className="w-full px-3 py-2 border rounded-md bg-gray-100" 
                               disabled 
                           />
                       </div>
                   </div>

                   <div>
                       <label className="block text-sm font-medium mb-2">Email</label>
                       <input 
                           type="email" 
                           value={profile?.email || ''} 
                           className="w-full px-3 py-2 border rounded-md bg-gray-100" 
                           disabled 
                       />
                   </div>

                   <div>
                       <label className="block text-sm font-medium mb-2">Address</label>
                       <input 
                           type="text" 
                           name="address"
                           value={formData.address}
                           onChange={handleInputChange}
                           className="w-full px-3 py-2 border rounded-md" 
                       />
                       {errors.address && (
                           <div className="text-red-500 text-sm mt-1">{errors.address}</div>
                       )}
                   </div>

                   <div>
                       <label className="block text-sm font-medium mb-2">Phone</label>
                       <input 
                           type="text" 
                           name="phone"
                           value={formData.phone}
                           onChange={handleInputChange}
                           className="w-full px-3 py-2 border rounded-md" 
                       />
                       {errors.phone && (
                           <div className="text-red-500 text-sm mt-1">{errors.phone}</div>
                       )}
                   </div>

                   <div>
                       <label className="block text-sm font-medium mb-2">Profile Picture</label>
                       <input 
                           type="file" 
                           accept="image/*"
                           onChange={handleImageChange}
                           className="w-full px-3 py-2 border rounded-md" 
                       />
                       {previewImage && (
                           <div className="flex justify-center mt-4">
                               <img 
                                   src={previewImage} 
                                   alt="Profile Preview" 
                                   className="h-32 w-32 md:h-40 md:w-40 object-cover rounded-full"
                               />
                           </div>
                       )}
                   </div>

                   <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                       <button 
                           type="submit" 
                           className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                       >
                           Update Profile
                       </button>
                       <button 
                           type="button" 
                           onClick={onClose}
                           className="w-full sm:w-auto bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition"
                       >
                           Cancel
                       </button>
                   </div>
               </form>
           </div>
       </div>
   );
};

export default UserProfile;