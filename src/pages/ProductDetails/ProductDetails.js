import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { summaryApi } from '../../common'
import { displayNGNCurrency } from '../../helpers/displayCurrency'
import { FaStar, FaStarHalfAlt, FaRegStar, FaTrash, FaEdit } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { toast } from 'react-toastify';
import CategoryProductDisplay from '../../components/CategoryProductDisplay/CategoryProductDisplay';
import Context from '../../context';
import addToCart from '../../helpers/addToCart';




function ProductDetails() {
  const [dataDetails, setDataDetails] = useState({
    productName: "",
    productPrice: "",
    productsCategory: "",
    productDescription: "",
    productImage: [],
    productBrand: "",
    productDiscount: ""
  })

  const params = useParams()
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState("")
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false)
  const [zoomImage, setZoomImage] = useState({
    x: 0,
    y: 0
  })

  const {fetchUserDetails, fetchUserAddToCart} = useContext(Context)

  const navigate = useNavigate()

  const productImageListLoading = new Array(4).fill(null)

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(summaryApi.current_user.url, {
        method: summaryApi.current_user.method,
        credentials: 'include'
      });
      const data = await response.json();
      setCurrentUser(data?.data);
      console.log("User fetched successfully:", data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }

  const fetchProductDetails = async () => {
    setLoading(true)
    const response = await fetch(`${summaryApi.productDetails.url}/${params?.id}`, {
      method: summaryApi.productDetails.method,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setLoading(false)
    const responseData = await response.json()


    console.log("bisi", responseData)

    setDataDetails(responseData.data)
    setActiveImage(responseData.data.productImage[0])
  }

  // Fetch reviews for the product
  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`${summaryApi.getReviews.url}/${params?.id}`, {
        method: summaryApi.getReviews.method,
        credentials: 'include'
      });
      const data = await response.json();
      setReviews(data.data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await fetchProductDetails();
      await fetchProductReviews();
      await fetchCurrentUser();
    };
    fetchData();
  }, [params.id]);

  const handleImageHover = (image) => {
    setActiveImage(image)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (review.trim() && rating > 0) {
      try {
        const reviewData = {
          rating: rating,
          comment: review
        };

        const response = await fetch(`${summaryApi.postReview.url}/${params?.id}`, {
          method: summaryApi.postReview.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reviewData)
        });


        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        try {
          const data = JSON.parse(responseText);
          if (data.success) {
            fetchProductReviews();
            setReview("");
            setRating(0);
            toast.success(data.message)
          } else {
            toast.error(data.message || "Failed to post review");
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          toast.error("Error processing server response");
        }
      } catch (error) {
        console.error("Error posting review:", error);
        toast.error("Failed to submit review");
      }
    }
  }

  // Start editing a review
  const startEditReview = (review) => {
    setEditingReview(review);
    setReview(review.comment);
    setRating(review.rating);
  }

  // Update review
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (review.trim() && rating > 0) {
      try {
        const updateData = {
          reviewId: editingReview._id,
          userId: currentUser._id,
          rating: rating,
          comment: review
        };

        const response = await fetch(`${summaryApi.updateReview.url}/${params.id}`, {
          method: summaryApi.updateReview.method,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData)
        });

        const data = await response.json();
        if (data.success) {
          fetchProductReviews();
          setReview("");
          setRating(0);
          setEditingReview(null);
        }
      } catch (error) {
        console.error("Error updating review:", error);
      }
    }
  }

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      const deleteData = {
        reviewId: reviewId,
        userId: currentUser._id
      };

      const response = await fetch(`${summaryApi.deleteReview.url}/${params.id}`, {
        method: summaryApi.deleteReview.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deleteData)
      });

      const data = await response.json();
      if (data.success) {
        fetchProductReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  }

  const renderStarRating = (currentRating, setRatingFunc) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => setRatingFunc(star)}
        className="cursor-pointer text-yellow-500 text-xl"
      >
        {star <= currentRating ? <FaStar /> : <FaRegStar />}
      </span>
    ));
  }

  const handleZoomEnter = () => {
    setZoomOpen(true);
    setIsZoomed(true);
  };
  
  const handleZoomLeave = () => {
    setZoomOpen(false);
    setIsZoomed(false);
    setZoomImage({ x: 0, y: 0 });
  };
  
  const handleImageClick = () => {
    // Toggle zoom on click
    setZoomOpen(prev => !prev);
  };


  const handleZoomImage = useCallback((e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.target.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomImage({
      x,
      y
    });
  }, [isZoomed]);



  const handleAddToCart = (e, productId) => {
    addToCart(e, productId, fetchUserAddToCart);
}

const handleBuyNow = async (e) => {  
  await handleAddToCart(e, dataDetails?._id);  
  navigate("/cart");
}

  const handleImageZoomOut = ()=>{
    setZoomOpen(true)
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='min-h-[200px] flex flex-col lg:flex-row gap-4'>
        {/* product image section */}
        <div className='h-96 flex flex-col lg:flex-row-reverse gap-4'>
          <div className='relative h-[300px] w-[300px] lg:h-96 lg:w-96 bg-slate-200 flex items-center justify-center'>
            {loading ? (
              <div className='animate-pulse bg-slate-300 h-full w-full'></div>
            ) : (
              <img
                src={activeImage}
                alt={dataDetails.productName}
                className='h-full w-full object-scale-down mix-blend-multiply'
                onMouseEnter={handleZoomEnter}
        onMouseLeave={handleZoomLeave}
        onMouseMove={handleZoomImage}
        onClick={handleImageClick}
              />

            )}
            {
              zoomOpen && (
                <div
                className={`hidden lg:block absolute min-w-[400px] min-h-[400px] overflow-hidden bg-slate-300 p-1 -right-[510px] top-0 ${isZoomed ? 'block' : 'hidden'}`}
              >
                <div
                  className='w-full h-full min-h-[400px] min-w-[500px] mix-blend-multiply scale-150'
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: `${zoomImage.x}% ${zoomImage.y}%`,
                    backgroundRepeat: 'no-repeat'
                  }}
                >
  
                </div>
              </div>
              )
            }
            

          </div>

          <div className='h-full'>
            {loading ? (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {productImageListLoading.map((_, index) => (
                  <div
                    key={index}
                    className='h-20 w-20 bg-slate-200 rounded animate-pulse'
                  ></div>
                ))}
              </div>
            ) : (
              <div className='flex gap-2 lg:flex-col overflow-scroll scrollbar-none h-full'>
                {dataDetails?.productImage?.map((item, index) => (
                  <div
                    key={index}
                    className='h-20 w-20 bg-slate-200 rounded p-1'
                  >
                    <img
                      src={item}
                      alt={dataDetails.productName}
                      onMouseEnter={() => handleImageHover(item)}
                      onClick={() => handleImageHover(item)}
                      className='h-full w-full object-scale-down mix-blend-multiply cursor-pointer'
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* product details section */}
        {loading ? (
          <div className='flex flex-col gap-4 w-full'>
            <div className='h-8 w-1/2 bg-slate-200 animate-pulse rounded'></div>
            <div className='h-10 w-full bg-slate-200 animate-pulse rounded'></div>
            <div className='h-6 w-3/4 bg-slate-200 animate-pulse rounded'></div>
            <div className='h-6 w-1/2 bg-slate-200 animate-pulse rounded'></div>
            <div className='h-20 w-full bg-slate-200 animate-pulse rounded'></div>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <p className='bg-violet-300 text-blue-600 px-2 rounded-full inline-block w-fit'>
              Brand: {dataDetails?.productBrand}
            </p>
            <h2 className='text-2xl font-semibold'>{dataDetails?.productName}</h2>
            <p className='capitalize text-slate-500'>
              Category: {dataDetails?.productsCategory}
            </p>
            <div className='flex items-center gap-4'>
              <p className='font-bold text-xl'>
                Price: {displayNGNCurrency(dataDetails?.productPrice)}
              </p>
              <p className='text-red-500 line-through text-sm'>
                Discount: {displayNGNCurrency(dataDetails?.productDiscount)}
              </p>
            </div>
            <p className='font-medium'>
              <span className='text-xl font-bold mr-3'>Description:</span>
              {dataDetails.productDescription}
            </p>

            <div className='flex items-center gap-4 my-2'>
              <div className='flex text-yellow-500'>
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
              </div>
              <span className='text-gray-500'>(4.5/5)</span>
            </div>

            <div className='flex flex-wrap gap-4'>
              <button
                onClick={handleBuyNow}                 
                className='px-6 py-2 rounded bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-90 transition-all'>
                Buy Now
              </button>
              <button                 
                onClick={(e) => handleAddToCart(e, dataDetails?._id)} 
                className='px-6 py-2 rounded border-2 border-violet-600 text-violet-600 hover:bg-violet-100 transition-all'>
                Add to Cart
              </button>
              <button className='px-6 py-2 rounded bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 transition-all'>
                Add to Wishlist
              </button>
            </div>
          </div>
        )}
      </div>

      {
        dataDetails.productsCategory && (
          <CategoryProductDisplay productsCategory={dataDetails.productsCategory} heading={"Recommended Products"}/>
        )
      }

      

      {/* Review Section */}
      <div className='mt-8 bg-gray-50 p-6 rounded-lg'>
        <h3 className='text-2xl font-bold mb-4 flex items-center gap-2'>
          <MdOutlineRateReview /> Reviews ({reviews.length})
        </h3>

        {/* Review Form */}
        <form onSubmit={editingReview ? handleUpdateReview : handleSubmitReview} className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Your Rating:</span>
              <div className='flex'>
                {renderStarRating(rating, setRating)}
              </div>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder='Write your review here...'
              className='w-full p-3 border rounded-lg focus:outline-violet-500'
              rows={4}
            ></textarea>
            <button
              type='submit'
              className='self-start px-6 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition-all'
            >
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
            {editingReview && (
              <button
                type='button'
                onClick={() => {
                  setEditingReview(null);
                  setReview('');
                  setRating(0);
                }}
                className='self-start px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all'
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Review List */}
        {reviews.length > 0 && (
          <div>
            {reviews.map(reviewItem => (
              <div
                key={reviewItem._id}
                className='bg-white p-4 rounded-lg shadow-sm mb-4 relative'
              >
                <div className='flex justify-between items-center mb-2'>
                  <div className='flex text-yellow-500'>
                    {[...Array(reviewItem.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                  <span className='text-slate-900 text-sm'>
                    {new Date(reviewItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p>{reviewItem.comment}</p>



                {/* User-specific review actions */}
                {currentUser && (currentUser._id == reviewItem.userId) && (
                  <div className='absolute top-2 right-2 flex gap-2 items-center'>
                    <div className='flex items-center gap-2'>
                      {currentUser.profilePic && (
                        <img
                          src={currentUser.profilePic}
                          alt={currentUser.firstName}
                          className='w-8 h-8 rounded-full object-cover'
                        />
                      )}
                      <span className='text-sm text-gray-700'>{currentUser.firstName}</span>
                    </div>
                    <button
                      onClick={() => startEditReview(reviewItem)}
                      className='text-blue-500 hover:text-blue-700'
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(reviewItem._id)}
                      className='text-red-500 hover:text-red-700'
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetails