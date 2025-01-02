import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import productCategory from "../../helpers/productCategory";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../../helpers/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdOutlineDeleteForever } from "react-icons/md";
import { summaryApi } from "../../common";
import { toast } from "react-toastify";

function EditProducts({
    onClose,
    productData,
    fetchData
}) {

    const [data, setData] = useState({
        ...productData,
        productName: productData?.productName || '',
        productImage: productData?.productImage || [],
        productBrand: productData?.productBrand || '',
        productPrice: productData?.productPrice || '',
        productsCategory: productData?.productsCategory || '',
        productDiscount: productData?.productDiscount || '',
        productDescription: productData?.productDescription || ''    
    });

    const [uploadProductImageInput, setUploadProductImageInput] = useState("");
    const [fullScreenImage, setFullScreenImage] = useState("")
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
    const [imagePreview, setImagePreview] = useState("");
    const [isUploading, setIsUploading] = useState(false);




    const handleOnChange = (e) => {
        const { name, value } = e.target
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUploadProduct = async (e) => {
        try {
            const file = e.target.files[0];
            if (!file) return;

            setIsUploading(true);
            setUploadProductImageInput(file.name);

            // with this line of code i created an image upload preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // i am uploading to Cloudinary with this line
            const uploadResult = await uploadImage(file);
            console.log("Upload successful:", uploadResult);

            // with this line i added the uploaded image URL to my form data
            setData((prev) => ({
                ...prev,
                productImage: [...prev.productImage, uploadResult.secure_url],
            }));
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage]
        newProductImage.splice(index, 1)
        setData((prev) => ({
            ...prev,
            productImage: [...newProductImage],
        }));

    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        console.log("first", data)

        const response = await fetch(`${summaryApi.updateProduct.url}/${productData._id}`,{
            method: summaryApi.updateProduct.method,
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName: data?.productName,
                productImage: data.productImage,
                productBrand: data.productBrand,
                productPrice: data.productPrice,
                productsCategory: data.productsCategory,
                productDiscount: data.productDiscount,
                productDescription: data.productDescription,
            })
        })
        const responseData = await response.json();
        console.log("update", responseData)

        if(responseData.success){
            toast.success(responseData?.message)
            onClose()
            fetchData()            
        }

        if (responseData.error) {
            toast.error(responseData?.message)            
        }
        
    }


  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-center items-center bg-pink-200 bg-opacity-50">
            <div className="bg-gradient-to-r from-violet-300 to-pink-300 shadow-md p-4 rounded w-full max-w-2xl h-full max-h-[90%] overflow-auto">
                <div className="flex justify-between items-center pb-3 sticky top-0 bg-gradient-to-r from-violet-300 to-pink-300 z-10">
                    <h2>
                        <span className="text-lg font-bold text-violet-900">
                            Edit Products
                        </span>
                    </h2>
                    <div
                        onClick={onClose}
                        className="w-fit ml-auto cursor-pointer text-2xl hover:text-pink-900"
                    >
                        <IoCloseCircleOutline />
                    </div>
                </div>

                <form className="grid gap-3 p-4" onSubmit={handleSubmit}>
                    <label htmlFor="productName">Product Name :</label>
                    <input
                        type="text"
                        id="productName"
                        placeholder="Enter Product Name"
                        value={data?.productName}
                        onChange={handleOnChange}
                        name="productName"
                        required
                        className="p-2 bg-pink-200 border rounded"
                    />

                    <label htmlFor="productImage">Product Image :</label>
                    <label htmlFor="uploadImageInput">
                        <div className="p-2 bg-pink-200 border rounded h-32 w-full flex justify-center items-center cursor-pointer">
                            <div className="text-pink-950 flex justify-center items-center flex-col gap-2">
                                <span className="text-4xl">
                                    <FaCloudUploadAlt />
                                </span>
                                <p className="text-sm">
                                    {isUploading ? "Uploading..." : "Upload Product Image"}
                                </p>
                                <input
                                    type="file"
                                    id="uploadImageInput"
                                    className="hidden"
                                    onChange={handleUploadProduct}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </label>

                    {imagePreview && (
                        <div>
                            <img
                                src={imagePreview}
                                alt="Product preview"
                                className="w-20 h-20 object-cover bg-pink-200 border"
                            />
                        </div>
                    )}
                    <div>
                        {data?.productImage[0] ? (
                            <div className="flex items-center gap-2">
                                {
                                    data.productImage.map((image, index) => {
                                        return (
                                            <div key={`${image}-${index}`} className="relative group">
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt="Product preview"
                                                    width={80}
                                                    height={80}
                                                    onClick={() => {
                                                        setOpenFullScreenImage(true);
                                                        setFullScreenImage(image);
                                                    }}
                                                    className="object-cover bg-pink-200 border cursor-pointer"
                                                />
                                                <div
                                                    onClick={() => handleDeleteProductImage(index)}
                                                    className="absolute bottom-0 right-0 p-1 text-white-500 bg-gradient-to-r from-violet-600 to-pink-600 shadow-md rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 hover:text-pink-950 hidden group-hover:block cursor-pointer">
                                                    <MdOutlineDeleteForever />
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        ) : (
                            <p className="text-pink-950 text-xs">*Please upload product image</p>
                        )}
                    </div>

                    <label htmlFor="productBrand">Product Brand :</label>
                    <input
                        type="text"
                        id="productBrand"
                        placeholder="Enter Product Brand"
                        value={data.productBrand}
                        name="productBrand"
                        onChange={handleOnChange}
                        required
                        className="p-2 bg-pink-200 border rounded"
                    />

                    <label htmlFor="productPrice">Product Price :</label>
                    <input
                        type="number"
                        id="productPrice"
                        placeholder="Enter Product Price"
                        value={data.productPrice}
                        name="productPrice"
                        onChange={handleOnChange}
                        required
                        className="p-2 bg-pink-200 border rounded"
                    />

                    <label htmlFor="productDiscount">Product Discount (%) :</label>
                    <input
                        type="number"
                        id="productDiscount"
                        placeholder="Enter Product Discount"
                        value={data.productDiscount}
                        name="productDiscount"
                        onChange={handleOnChange}
                        required
                        className="p-2 bg-pink-200 border rounded"
                    />


                    <label htmlFor="productsCategory">Product Category :</label>
                    <select
                        value={data.productsCategory}
                        onChange={handleOnChange}
                        id="productsCategory"
                        required
                        name="productsCategory"
                        className="p-2 bg-pink-200 border rounded"
                    >
                        <option value={""}>
                                    Select Category
                                </option>
                        {productCategory.map((item, index) => {
                            return (
                                <option key={item.value + index} value={item.value}>
                                    {item.label}
                                </option>
                            );
                        })}
                    </select>


                    <label htmlFor="productDescription">Product Description :</label>
                    <textarea
                        id="productDescription"
                        placeholder="Enter Product Description"
                        value={data.productDescription}
                        name="productDescription"
                        onChange={handleOnChange}
                        className="p-2 bg-pink-200 border rounded min-h-[120px] resize-y"
                    />

                    <div className="sticky bottom-0 bg-gradient-to-r from-violet-300 to-pink-300 pt-4 mt-4">
                        <button
                            type="submit"
                            className="w-full px-6 py-2 rounded-r-full bg-gradient-to-r from-violet-600 to-pink-600
                             text-white transition-all duration-300 hover:shadow-lg hover:scale-105 mb-2"
                        >
                            Update Product
                        </button>

                        <button
                            type="button"
                            className="w-full px-6 py-2 rounded-l-full bg-gradient-to-r from-pink-600 to-violet-600
                              text-white transition-all duration-300 hover:shadow-lg hover:scale-105 mb-4"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <div className="text-center pb-2">
                            <p className="text-pink-950 text-sm font-medium">
                                *All fields are required
                            </p>
                        </div>
                    </div>
                </form>
            </div>
            {/* Displaying the productImage full screen */}
            {
                openFullScreenImage && (
                    <div>
                        <DisplayImage
                            onClose={() => setOpenFullScreenImage(false)}
                            imgUrl={fullScreenImage}
                            name={uploadProductImageInput}
                        />
                        <p className="text-sm font-bold text-gray-600">Name: {uploadProductImageInput}</p>
                    </div>
                )
            }

        </div>
  )
}

export default EditProducts