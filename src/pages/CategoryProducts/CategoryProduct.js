import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import productCategory from '../../helpers/productCategory'
import ViewSearch from '../../components/ViewSearch/ViewSearch'
import { summaryApi } from '../../common'

function CategoryProduct() {
  const location = useLocation()
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("")
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const getUrlCategories = () => {
    const searchParams = new URLSearchParams(location.search)
    return searchParams.getAll('category').filter(Boolean)
  }

  const [selectCategory, setSelectCategory] = useState(
    Object.fromEntries(getUrlCategories().map(cat => [cat, true]))
  )
  const [filterCategoryList, setFilterCategoryList] = useState(getUrlCategories())

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(summaryApi.filterProducts.url, {
        method: summaryApi.filterProducts.method,
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productsCategory: filterCategoryList
        })
      })
      const responseData = await response.json()
      setLoading(false)
      setData(responseData?.data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setLoading(false)
    }
  }
  
  const handleSelectCategory = (e) => {
    const {value, checked} = e.target
    setSelectCategory((prev) => ({
     ...prev,
      [value]: checked
    }))   
  }

  useEffect(() => {
    fetchData()
  }, [filterCategoryList])

  useEffect(() => {
    const arrayOfCategory = Object.keys(selectCategory)
      .filter(item => selectCategory[item])
    
    setFilterCategoryList(arrayOfCategory)

    const urlSearchParams = new URLSearchParams()
    arrayOfCategory.forEach(category => {
      urlSearchParams.append('category', category)
    })

    const newUrl = arrayOfCategory.length 
      ? `/product-category?${urlSearchParams.toString()}` 
      : '/product-category'

    navigate(newUrl, { replace: true })
  }, [selectCategory, navigate])

  const handleOnChangeSortBy = (e) => {
    const { value } = e.target
    setSortBy(value)

    const sortedData = [...data]
    
    if (value === 'lowToHigh') {
      sortedData.sort((a, b) => a.productPrice - b.productPrice)
    }
    if (value === 'highToLow') {
      sortedData.sort((a, b) => b.productPrice - a.productPrice)
    }

    setData(sortedData)
  }

  // Render filter sidebar for mobile and desktop
  const renderFilterSidebar = (isMobile = false) => (
    <div 
      className={`
        ${isMobile 
          ? 'fixed inset-0 z-50 bg-blue-100 bg-opacity-95 p-4 overflow-y-auto backdrop-blur-sm' 
          : 'bg-slate-200 p-2'}
        ${!isMobile && 'hidden lg:block min-h-[calc(100vh-120px)] overflow-y-scroll'}
        shadow-lg rounded-lg
      `}
    >
      {isMobile && (
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-slate-800'>Filters</h2>
          <button 
            onClick={() => setMobileFilterOpen(false)}
            className='text-gray-600 hover:text-gray-900 bg-white rounded-full p-2 shadow-md'
          >
            ✕
          </button>
        </div>
      )}


      {/* Sort By Section */}
      <div className='mb-4'>
        <h3 className='text-base uppercase font-medium text-slate-800 border-b pb-1 border-slate-400'>
          Sort by
        </h3>
        <form className='text-sm flex flex-col gap-2 py-2'>
          <div className='flex items-center gap-3'>
            <input 
              type='radio' 
              name='sortBy' 
              value='lowToHigh'
              onChange={handleOnChangeSortBy}
              checked={sortBy === 'lowToHigh'}
            />
            <label>Price: Low to High</label>
          </div>
          <div className='flex items-center gap-3'>
            <input 
              type='radio' 
              name='sortBy' 
              value='highToLow'
              onChange={handleOnChangeSortBy}
              checked={sortBy === 'highToLow'}
            />
            <label>Price: High to Low</label>
          </div>
        </form>
      </div>

      {/* Category Section */}
      <div>
        <h3 className='text-base uppercase font-medium text-slate-800 border-b pb-1 border-slate-400'>
          Category
        </h3>
        <form className='text-sm flex flex-col gap-2 py-2'>
          {productCategory.map((item, index) => (
            <div key={index} className='flex items-center gap-3'>
              <input 
                type='checkbox' 
                name={`category-${item.value}`}   
                value={item?.value} 
                id={item?.value} 
                checked={!!selectCategory[item?.value]}  
                onChange={handleSelectCategory}
              />
              <label htmlFor={item?.value}>
                {item?.label}
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  )

  return (
    <div className='container mx-auto p-4'>
      {/* Mobile Filter Toggle */}
      <div className='lg:hidden flex justify-between items-center mb-4'>
        <p className='font-medium text-slate-800 text-lg'>
          Search Results: {data?.length}
        </p>
        <button 
          onClick={() => setMobileFilterOpen(true)}
          className='flex items-center gap-2 bg-slate-200 p-2 rounded'
        >
          Filters
        </button>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className='lg:hidden bg-blue-200'>
          {renderFilterSidebar(true)}
        </div>
      )}

      {/* Main Content Layout */}
      <div className='grid grid-cols-1 lg:grid-cols-[200px,1fr] gap-4'>
        {/* Desktop Sidebar */}
        {renderFilterSidebar()}

        {/* Product List */}
        <div className='lg:px-4'>
          <p className='hidden lg:block font-medium text-slate-800 text-lg my-2'>
            Search Results: {data?.length}
          </p>
          <div className='min-h-[calc(100vh-120px)] overflow-y-scroll max-h-[calc(100vh-120px)]'>
            {data.length !== 0 && (
              <ViewSearch data={data}/>
            )}
            {data.length === 0 && (
              <p className='text-center text-gray-500 mt-10'>
                No products found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryProduct