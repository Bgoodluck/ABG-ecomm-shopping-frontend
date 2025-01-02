import React, { useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../../assest/signin.gif";
import imageTobase64 from "../../helpers/imageTobase64";
import {summaryApi} from "../../common";
import { toast } from "react-toastify";

function Signup(){
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState(null);
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePic: null   
  });
  const navigate = useNavigate();

  const handleOnChange = (e)=>{
    const { name, value } = e.target
    setData((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  const handleUploadPic = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPEG, PNG, and GIF images are allowed");
        return;
      }

      // Directly store the file instead of base64 string
      setData((prev) => ({
        ...prev,
        profilePic: file,
      }));
    }
  };

  const handleSubmit = async(e)=>{
    e.preventDefault()

    
    if(!data.firstName.trim()){
      toast.error("First Name is required");
      return;
    }

    if(!data.lastName.trim()){
      toast.error("Last Name is required");
      return;
    }

    if(!data.email.trim()){
      toast.error("Email is required");
      return;
    }

    if(data.password.length < 8){
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if(data.password !== data.confirmPassword){
      toast.error("Password and Confirm Password do not match!");
      return;
    }

    try {

      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('confirmPassword', data.confirmPassword);
      if (data.profilePic) {
        formData.append('profilePic', data.profilePic); 
      }


      const response = await fetch(summaryApi.signUp.url,{
        method: summaryApi.signUp.method,
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        body: formData,
      })

      const userData = await response.json()

      console.log("newlogin", userData)

      if(response.ok){        
        toast.success(userData.message)
        setData(prevData => ({
          ...prevData,
          profilePic: userData.profilePicPath 
        }))
        navigate("/login")
      } else {
        toast.error(userData.message || "Signup failed");
      }
  
    } catch (error) {
      toast.error("Network error. Please try again.");
      console.error(error);
    }   
  }

  const profilePic = data?.profilePic;  
  const imageUrl = `${process.env.REACT_APP_BACKEND_URL}/uploads/${profilePic}`;




  return (
    <section id="register" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-pink-100 to-violet-200 opacity-20" />
          
          {/* Login header */}
          <div className="relative text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Welcome To ABG(AllBuy&Go) Shopping Website
            </h2>
            <div className="w-20 h-20 mx-auto mt-2 mb-2 rounded-full relative">
            <div>
            <img
              src={imageUrl || loginIcons}
              alt="login icon"
              className="mix-blend-multiply w-20 h-20 rounded-full"
            />
            </div>
            <form>
              <label>
                <div className="text-xs bg-opacity-95 rounded-full cursor-pointer bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600 text-violet-900 py-2 px-1 text-center absolute bottom-0">
                     Upload image
                </div>
                 <input type="file" className="hidden" onChange={handleUploadPic}/>
              </label>
            </form>
          </div>          
            <p className="text-slate-500 mt-2 text-sm">
              Register to begin your shopping experience.
            </p>
          </div>

          <form 
            className="relative space-y-6"
            onSubmit={handleSubmit}
            >
                {/* Name Input */}
                <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'firstName' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                First Name
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="text"
                  placeholder="Enter your firstName"
                  name="firstName"
                  required
                  value={data.firstName}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('firstName')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'firstName' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Last Name Input */}

            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'lastName' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Last Name
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="text"
                  placeholder="Enter your lastName"
                  name="lastName"

                  value={data.lastName}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('lastName')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'lastName' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'email' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Email
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  required
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                />
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'email' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'password' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Password
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  onChange={handleOnChange}
                  name="password"
                  required
                  value={data.password}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                >
                  {showPassword ? <FaRegEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'password' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <label 
                className={`text-sm font-medium transition-all duration-200 ${
                  focusedInput === 'confirmPassword' ? 'text-violet-600' : 'text-slate-600'
                }`}
              >
                Confirm Password
              </label>
              <div className={`mt-2 relative group`}>
                <input
                  type={showConfirmPassword ? "text" : "Password"}
                  placeholder="Confirm your password"
                  onChange={handleOnChange}
                  name="confirmPassword"
                  required
                  value={data.confirmPassword}
                  className="w-full px-4 py-3 rounded-lg bg-slate-50 border outline-none transition-all duration-300
                    focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                  onFocus={() => setFocusedInput('confirmPassword')}
                  onBlur={() => setFocusedInput(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-violet-600 transition-colors"
                >
                  {showConfirmPassword ? <FaRegEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 transition-all duration-300
                  ${focusedInput === 'confirmPassword' ? 'w-full' : 'w-0'}`} />
              </div>
            </div>

            
            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium
                transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-violet-400 active:scale-[0.98]"
            >
              Sign In
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;