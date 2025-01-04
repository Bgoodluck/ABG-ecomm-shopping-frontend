import React, { useState, useEffect, useContext, useRef } from "react";
import Logo from "../Logo/Logo";
import { IoSearch, IoMenu, IoClose } from "react-icons/io5";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { summaryApi } from "../../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../../store/userSlice";
import { ROLE } from "../../common/role";
import Context from "../../context";
import UserProfile from "../UserProfile/UserProfile";
import ProfileModal from "../UserProfileModal/UserProfileModal";
import fallbackIcon from "../../assest/logo2.png"

const Header = () => {
  const user = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q");
  const [search, setSearch] = useState(searchQuery);
  const profileMenuRef = useRef(null);

  const context = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth >= 1024) {
        setIsTransparent(window.scrollY < 100);
      } else {
        setIsTransparent(false);
      }
    };

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsMobileView(screenWidth < 1024);

      if (screenWidth < 1024) {
        setIsTransparent(false);
      } else {
        setIsTransparent(window.scrollY < 100);
      }
    };

    handleResize();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = async () => {
    const response = await fetch(summaryApi.logout.url, {
      method: summaryApi.logout.method,
      credentials: "include",
    });
    const data = await response.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      localStorage.removeItem("token");
      setIsMobileMenuOpen(false);
      setIsProfileMenuOpen(false);
      navigate("/");
    }

    if (data.error) {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const profilePicUrl = user?.profilePic
    ? `${process.env.REACT_APP_BACKEND_URL}/${user.profilePic.replace(
        /\\/g,
        "/"
      )}`
    : null;

  const MobileMenu = () => (
    <div
      className="inset-0 bg-white z-40 lg:hidden 
      transform transition-transform duration-300 ease-in-out 
      flex flex-col pt-20 px-6 space-y-4 overflow-y-auto"
    >
      {/* Mobile Search */}
      <div className="w-full">
        <div className="relative flex items-center rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search products here..."
            className="w-full px-6 py-3 rounded-full outline-none bg-slate-50"
            onChange={handleSearchFocus}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            value={search}
          />
          <button className="absolute right-0 px-6 py-3 rounded-r-full">
            <IoSearch className="text-xl text-violet-600" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Links */}
      <div className="space-y-4">
        {user?._id && (
          <>
            <button
              onClick={() => {
                setIsProfileModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="block px-4 py-2 text-xs rounded-lg bg-violet-50 text-violet-800 text-center"
            >
              Edit Profile
            </button>
            <b className="text-blue-600 font-bold mb-3 ">
              {user?.firstName} {user?.lastName}
            </b>
            <div className="flex items-center justify-center mb-4">
              {user?.profilePic ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-violet-600">
                  <img
                    src={profilePicUrl || fallbackIcon}
                    alt={user.firstName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <FaRegCircleUser className="text-6xl text-violet-600" />
              )}
            </div>
            <Link
              to="/orders"
              className="block px-4 py-3 rounded-lg bg-violet-50 text-violet-800 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Order History
            </Link>
            {user?.role === ROLE.ADMIN && (
              <Link
                to="/admin-panel"
                className="block px-4 py-3 rounded-lg bg-violet-50 text-violet-800 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
          </>
        )}

        {/* Login/Logout Button */}
        {user?._id ? (
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 rounded-full text-white
            bg-gradient-to-r from-violet-600 to-pink-600"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="block w-full px-6 py-3 rounded-full text-white text-center
            bg-gradient-to-r from-violet-600 to-pink-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );

  const handleSearchFocus = (e) => {
    const { value } = e.target;
    setSearch(value);

    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const trimmedSearch = search.trim();
    if (trimmedSearch) {
      navigate(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsProfileMenuOpen(false);
  };

  const handleProfileMenuEnter = () => {
    setIsProfileMenuOpen(true);
    setIsHovering(true);
  };

  const handleProfileMenuLeave = () => {
    setIsHovering(false);
    // Add a small delay before closing to allow moving to submenu
    setTimeout(() => {
      if (!isHovering) {
        setIsProfileMenuOpen(false);
      }
    }, 100);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleOrderHistory = () => {
    navigate("/orders");
  };

  return (
    <>
      <header
        className={`
    ${isMobileView ? "absolute" : "fixed"} 
    top-0 left-0 right-0 z-30 w-full transition-all duration-300
    ${
      isTransparent
        ? "bg-white-300/70 backdrop-blur-sm"
        : "bg-white-300 shadow-lg"
    }`}
      >
        {/* Gradient line at top */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 
            ${
              isTransparent
                ? "bg-gradient-to-r from-violet-600/50 to-pink-600/50"
                : "bg-gradient-to-r from-violet-600 to-pink-600"
            }`}
        />

        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo Section */}
            <Link
              to="/"
              className="relative group transition-transform duration-300 hover:scale-105"
            >
              <Logo w={80} h={60} />
              <div
                className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-pink-600 
                transition-all duration-300 group-hover:w-full"
              />
            </Link>

            {/* Search Section - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <div
                className={`relative flex items-center w-full rounded-full
                transition-all duration-300 ${
                  isSearchFocused
                    ? "shadow-lg ring-2 ring-violet-200"
                    : "shadow-md hover:shadow-lg"
                }`}
              >
                <input
                  type="text"
                  placeholder="Search products here..."
                  className="w-full px-6 py-2 rounded-l-full outline-none bg-slate-50"
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  onChange={handleSearchFocus}
                  value={search}
                />
                <button
                  className="px-6 py-2 rounded-r-full bg-gradient-to-r from-violet-600 to-blue-400
                  text-white-300 transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <IoSearch className="text-xl" />
                </button>
              </div>
            </div>

            {/* Mobile Search Icon */}
            <div className="lg:hidden flex items-center gap-4">
              <Link to={"/cart"} className="relative group p-2">
                <FaShoppingCart
                  className="text-2xl text-slate-600 transition-colors duration-300
                  group-hover:text-violet-600"
                />
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                  rounded-full text-xs text-white-300 bg-gradient-to-r from-violet-600 to-pink-600
                  transform transition-transform duration-300 group-hover:scale-110"
                >
                  {context?.cartCount}
                </span>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-3xl text-violet-600"
              >
                {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
              </button>
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-6">
              <b>{user?.firstName}</b>
              <div
                className="relative group"
                onMouseEnter={handleProfileMenuEnter}
                onMouseLeave={handleProfileMenuLeave}
                ref={profileMenuRef}
              >
                {user?._id && (
                  <button className="relative p-2" onClick={handleProfileClick}>
                    {user?.profilePic ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={profilePicUrl || fallbackIcon}
                          alt={user.firstName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <FaRegCircleUser className="text-2xl text-slate-600 transition-colors duration-300 group-hover:text-violet-600" />
                    )}
                  </button>
                )}

                {isProfileMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white-300 ring-1 ring-black ring-opacity-5 
        transform origin-top-right transition-all duration-300 ease-in-out z-50"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={handleProfileMenuLeave}
                  >
                    <nav className="py-1 bg-white-300 text-black-900">
                      <button
                        onClick={handleOrderHistory}
                        className="w-full text-left block px-4 py-2 text-sm text-slate-900 hover:bg-gradient-to-r hover:from-violet-600 
          hover:to-pink-600 hover:text-white-300 transition-all duration-300 first:rounded-t-lg"
                      >
                        Order History
                      </button>

                      {user?.role === ROLE.ADMIN && (
                        <Link
                          to="/admin-panel"
                          className="block px-4 py-2 text-sm text-slate-900 hover:bg-gradient-to-r hover:from-violet-600 
            hover:to-pink-600 hover:text-white-300 transition-all duration-300"
                        >
                          Admin Panel
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-slate-900 hover:bg-gradient-to-r 
          hover:from-violet-600 hover:to-pink-600 hover:text-white-300 transition-all duration-300 
          last:rounded-b-lg"
                      >
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </div>

              {user?._id && (
                <Link to={"/cart"} className="relative group p-2">
                  <FaShoppingCart
                    className="text-2xl text-slate-600 transition-colors duration-300
                  group-hover:text-violet-600"
                  />
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center
                  rounded-full text-xs text-white-300 bg-gradient-to-r from-violet-600 to-pink-600
                  transform transition-transform duration-300 group-hover:scale-110"
                  >
                    {context?.cartCount}
                  </span>
                </Link>
              )}

              <div>
                {user?._id ? (
                  <button
                    onClick={handleLogout}
                    className="relative overflow-hidden px-6 py-2 rounded-full text-white-300
                    bg-gradient-to-r from-violet-600 to-blue-400"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="relative overflow-hidden px-6 py-2 rounded-full text-white-300
                    bg-gradient-to-r from-violet-600 to-pink-600"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 h-1 
            ${
              isTransparent
                ? "bg-gradient-to-r from-violet-600/50 to-pink-600/50"
                : "bg-gradient-to-r from-violet-600 to-pink-600"
            }`}
        />
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <MobileMenu />}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black-900 bg-opacity-50"
      >
        <UserProfile onClose={handleCloseProfileModal} userId={user?._id} />
      </ProfileModal>
    </>
  );
};

export default Header;