import React, { useEffect, useState, useCallback } from 'react'
import image1 from "../../assest/banner/img1.webp"
import image2 from "../../assest/banner/img2.webp"
import image3 from "../../assest/banner/img3.jpg"
import image4 from "../../assest/banner/img4.jpg"
import image5 from "../../assest/banner/img5.webp"
import image1Mobile from "../../assest/banner/img1_mobile.jpg"
import image2Mobile from "../../assest/banner/img2_mobile.webp"
import image3Mobile from "../../assest/banner/img3_mobile.jpg"
import image4Mobile from "../../assest/banner/img4_mobile.jpg"
import image5Mobile from "../../assest/banner/img5_mobile.png"
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

function BannerProduct() {
    const [currentImage, setCurrentImage] = useState(0)

    const desktopImages = [
        image1, image2, image3, image4, image5
    ]

    const mobileImages = [
        image1Mobile, image2Mobile, image3Mobile, image4Mobile, image5Mobile
    ]

    const handleLeftClick = useCallback(() => {
        setCurrentImage(prev => 
            prev === 0 ? desktopImages.length - 1 : prev - 1
        )
    }, [desktopImages.length])

    const handleRightClick = useCallback(() => {
        setCurrentImage(prev => 
            prev === desktopImages.length - 1 ? 0 : prev + 1
        )
    }, [desktopImages.length])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage(prev => 
                prev === desktopImages.length - 1 ? 0 : prev + 1
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [desktopImages.length])
    
    return (
        <div className='container mx-auto px-4 rounded'>
            <div className='h-56 md:h-72 w-full bg-gradient-to-r from-violet-100 to-pink-100 relative'>
                <div className='absolute z-10 w-full h-full md:flex items-center hidden'>
                    <div className='flex justify-between w-full text-2xl'>
                        <button 
                            className='bg-white shadow-md rounded-full p-1' 
                            onClick={handleLeftClick}
                        >
                            <FaAngleLeft />
                        </button>
                        <button 
                            className='bg-white shadow-md rounded-full p-1' 
                            onClick={handleRightClick}
                        >
                            <FaAngleRight />
                        </button>
                    </div>                
                </div>
                {/* Desktop Images */}
                <div className='hidden md:flex h-full w-full overflow-hidden'>
                    {desktopImages.map((imageUrl, index) => (
                        <div 
                            key={index} 
                            className="absolute w-full h-full transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                                opacity: Math.abs(index - currentImage) < 1 ? 1 : 0
                            }}
                        >
                            <img 
                                className='w-full h-full' 
                                src={imageUrl} 
                                alt={`banner-image-${index + 1}`} 
                            /> 
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-15"></div>            
                        </div>
                    ))}
                </div>
                {/* For my Mobile Images & view */}
                <div className='flex h-full w-full overflow-hidden md:hidden'>
                    {mobileImages.map((imageUrl, index) => (
                        <div 
                            key={index} 
                            className="absolute w-full h-full transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(${(index - currentImage) * 100}%)`,
                                opacity: Math.abs(index - currentImage) < 1 ? 1 : 0
                            }}
                        >
                            <img 
                                className='w-full h-full' 
                                src={imageUrl} 
                                alt={`banner-image-${index + 1}`} 
                            /> 
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-pink-600 opacity-15"></div>            
                        </div>
                    ))}
                </div>
            </div>        
        </div>
    )
}

export default BannerProduct