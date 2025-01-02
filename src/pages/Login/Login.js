import React, { useContext, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import loginIcons from "../../assest/signin.gif";
import { summaryApi } from "../../common";
import { toast } from "react-toastify";
import Context from "../../context";

function Login(){
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [data, setData] = useState({
    email: '',
    password: ''    
  });
  const navigate = useNavigate()
  const {fetchUserDetails, fetchUserAddToCart} = useContext(Context)

  const handleOnChange = (e)=>{
    const { name, value } = e.target
    setData((prev)=>({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!data.email || !data.password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const response = await fetch(summaryApi.signIn.url, {
        method: summaryApi.signIn.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

     
      const responseData = await response.json();

      
      if (response.ok) {
       
        if (responseData.success) {
          localStorage.setItem("user", JSON.stringify(responseData.userData));
          toast.success(responseData.message || "Login successful");
          navigate("/");
          fetchUserDetails()
          fetchUserAddToCart()
        } else {
          
          toast.error(responseData.message || "Login failed");
        }
      } else {

        switch (response.status) {
          case 401:
            toast.error("Invalid email or password");
            break;
          case 404:
            toast.error("User not found");
            break;
          case 500:
            toast.error("Server error. Please try again later.");
            break;
          default:
            toast.error(responseData.message || "An error occurred during login");
        }
      }
    } catch (error) {
      
      console.error("Login error:", error);
      toast.error("Unable to connect to the server. Please check your internet connection.");
    }
  }


  return (
    <section id="login" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-pink-100 to-violet-200 opacity-20" />
          
          {/* Login header */}
          <div className="relative text-center mb-8">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <div className="w-20 h-20 mx-auto mt-2 mb-2 rounded-full">
            <img
              src={loginIcons}
              alt="login icon"
              className="mix-blend-multiply"
            />
          </div>
            <p className="text-slate-500 mt-2 text-sm">
              Sign in to continue your journey
            </p>
          </div>

          <form 
            className="relative space-y-6"
            onSubmit={handleSubmit}
            >
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

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link 
                to="/forgot-password"
                className="text-sm text-slate-600 hover:text-violet-600 transition-colors hover:underline"
              >
                Forgot password?
              </Link>
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
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-violet-600 hover:text-violet-700 transition-colors hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;