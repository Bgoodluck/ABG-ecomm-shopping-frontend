import { createBrowserRouter } from "react-router-dom"
import App from "../App"
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Signup from "../pages/Signup/Signup";
import Admin from "../pages/AdminPanel/Admin";
import AllUsers from "../pages/AdminPanel/AllUsers";
import AllProducts from "../pages/AdminPanel/AllProducts";
import CategoryProduct from "../pages/CategoryProducts/CategoryProduct";
import ProductDetails from "../pages/ProductDetails/ProductDetails";
import Cart from "../pages/Cart/Cart";
import SearchProducts from "../pages/SearchProducts/SearchProducts";
import Checkout from "../pages/Checkout/Checkout";
import UserOrder from "../pages/Order/UserOrder";
import StripeVerify from "../pages/VerifyPayment/StripeVerify";
import FlutterVerify from "../pages/VerifyPayment/FlutterVerify";
import UserProfile from "../components/UserProfile/UserProfile";
import ProfileModal from "../components/UserProfileModal/UserProfileModal";
import OrderInventory from "../pages/AdminPanel/OrderInventory";
import NewsletterAdmin from "../pages/AdminPanel/NewsletterAdmin";
import UnsubscribeForm from "../components/UnSubNewsletterBox/UnsubscribeForm";
import LiveChat from "../components/ChatMessageAssistant/LiveChat";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                 path: "/",
                 element: <Home/> 
            },
            {
                path: "login",
                element: <Login/>
            },
            {
                path: "profile",
                element: <UserProfile/>
            },
            {
                path: "profilemodal",
                element: <ProfileModal/>
            },
            {
                path: "forgot-password",
                element: <ForgotPassword/>
            },
            {
                path: "register",
                element: <Signup/>
            },
            {
                path: "product-category",
                element: <CategoryProduct/>
            },
            {
                path: "product/:id",
                element: <ProductDetails/>
            },
            {
                path: 'cart',
                element: <Cart/>
            },
            {
                path: "checkout",
                element: <Checkout/>
            },
            {
                path: 'search',
                element: <SearchProducts/>
            },            
            {
                path: "orders",
                element: <UserOrder/>
            },
            {
                path: '/verify',
                element: <StripeVerify />
            },
            {
                path: '/flwverify',
                element: <FlutterVerify/>
            },
            {
                path: "unsubscribe",
                element: <UnsubscribeForm/>
            },
            {
                path: "livechat",
                element: <LiveChat/>
            },
            {
                path: "admin-panel",
                element: <Admin/>,
                children: [
                    {
                        path: "all-users",
                        element: <AllUsers/>
                    },
                    {
                        path: "all-products",
                        element: <AllProducts/>
                    },
                    {
                        path: "order-inventory",
                        element: <OrderInventory/>
                    },
                    {
                        path: "newsletter-admin",
                        element: <NewsletterAdmin/>
                    }
                ]
            }
        ]
    }
])

export default router;