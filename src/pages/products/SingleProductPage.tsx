import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Carousel } from 'flowbite-react'
import { redirect } from 'react-router-dom'

import { useGetSingleProductQuery } from '../../services/product'
import AddToCart from '../../components/cart/AddToCart'
import { AppState } from '../../app/store'
import UpdateProductForm from '../../components/product/UpdateProductForm'
import { isAdmin } from '../../components/user/userSlice'
import CustomBreadcrumb from '../../components/common/CustomBreadcrumb'
import { Feedback } from '../../misc/type'
import { cleanImageUrl, generateRandomImage } from '../../misc/utils'
import { useEffect } from 'react'
import RemoveProduct from './RemoveProduct'
import ProductCarousel from './ProductCarousel'


export default function SingleProductPage({
  feedback
}: {
  feedback: Feedback
}) {
  const nav = useNavigate()
  const admin = useSelector(isAdmin)
  const { productId } = useParams()

  const { data, error, isLoading } = useGetSingleProductQuery(Number(productId))

  useEffect(() => {
    if (error) {
      nav('/')
    }
  }, [error])

  const images = data?.images.map((img) => {
    return cleanImageUrl(img) ?? generateRandomImage()
  })
  const { isLoggedIn } = useSelector((state: AppState) => state.user)

  return (
    <div className='container mx-auto px-4 md:px-16 py-16'>
      <div className='grid md:grid-cols-2 gap-8'>
        <div>{data && <ProductCarousel images={images} />}</div>
        <div className='grid gap-2'>
          {data && (
            <div>
              {' '}
              <CustomBreadcrumb
                page={{
                  location: data?.category.name,
                  path: String(data?.category.id)
                }}
              />
            </div>
          )}

          {data && (
            <div className='grid gap-2'>
              <h2>{data.title}</h2>
              <p>€ {data.price}</p>
              <AddToCart id={data.id} />
            </div>
          )}
        </div>
      </div>

      <div className='py-12 grid md:grid-cols-2 gap-8'>
        {data && isLoggedIn && admin && (
          <UpdateProductForm product={data} feedback={feedback} />
        )}
        {data && isLoggedIn && admin && (
          <RemoveProduct id={data.id} feedback={feedback} />
        )}
      </div>
    </div>
  )
}
