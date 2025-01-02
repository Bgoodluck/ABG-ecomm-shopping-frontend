import React from 'react'
import { IoCloseCircleOutline } from 'react-icons/io5'

function DisplayImage({
    imgUrl,
    onClose,
    name
}) {
    return (
        <div className='fixed bottom-0 top-0 right-0 left-0 flex justify-center items-center'>

            <div className='bg-gradient-to-r from-violet-600 to-pink-600 shadow-md rounded max-w-3xl mx-auto p-4'>
                <div
                    onClick={onClose}
                    className="w-fit ml-auto cursor-pointer text-2xl hover:text-pink-900"
                >
                    <IoCloseCircleOutline />
                </div>
                <div className='flex justify-evenly p-4 max-h-[80vh] max-w-[80vw] gap-5'>
                    <img
                        src={imgUrl}
                        alt="Product Image"
                        className='w-[30%] h-[30%]'
                    />
                    <h2 className='font-bold text-black-900 text-2xl'>Product Name: <span className='text-xl'><b>{name}</b></span></h2>
                    

                </div>
            </div>

        </div>
    )
}

export default DisplayImage