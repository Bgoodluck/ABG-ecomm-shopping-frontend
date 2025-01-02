import React from 'react'
import CategoryList from '../../components/CategoryList/CategoryList'
import BannerProduct from '../../components/BannerProduct/BannerProduct'
import HorizontalCardProduct from '../../components/HorizontalCardProduct/HorizontalCardProduct'
import VerticalCardProduct from '../../components/VerticalCardProduct/VerticalCardProduct'
import NewsletterBox from '../../components/NewsletterBox/NewsletterBox'

function Home() {
  return (
    <div>
        <CategoryList/> 
        <BannerProduct/>

        <HorizontalCardProduct productsCategory={"airpods"} heading={"Best Selling Airpods"}/>
        <HorizontalCardProduct productsCategory={"mobiles"} heading={"Smart Phones"}/>

        <VerticalCardProduct productsCategory={"televisions"} heading={"Smart Televisions"}/>
        <VerticalCardProduct productsCategory={"watches"} heading={"Popular Smart Watches"}/>
        <VerticalCardProduct productsCategory={["speaker", "headphones"]} heading={"Bluetooth Speakers & Earphones"}/>
        <VerticalCardProduct productsCategory={["trimmers","refrigerator"]} heading={"Home Gadgets"}/>
        <VerticalCardProduct productsCategory={"camera"} heading={"Camera & Photography"}/>
        <VerticalCardProduct productsCategory={["mouse","processor","printer"]} heading={"Tech Gadgets"}/>

        <NewsletterBox/>
    </div>
  )
}

export default Home