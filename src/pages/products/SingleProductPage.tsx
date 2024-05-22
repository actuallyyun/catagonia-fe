import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  useGetReviewsByProductQuery,
  useGetSingleProductQuery
} from '../../services/product'
import AddToCart from '../../components/cart/AddToCart'
import { AppState } from '../../app/store'
import UpdateProductForm from '../../components/product/UpdateProductForm'
import { isAdmin } from '../../components/user/userSlice'
import CustomBreadcrumb from '../../components/common/CustomBreadcrumb'
import { Feedback } from '../../misc/type'
import { useEffect } from 'react'
import RemoveProduct from './RemoveProduct'
import ProductCarousel from './ProductCarousel'
import ProductReview from '../../components/product/ProductReview'
import { ShowLoading } from '../../components/common/feedback'

export default function SingleProductPage({
  feedback
}: {
  feedback: Feedback
}) {
  const nav = useNavigate()
  const admin = useSelector(isAdmin)
  const { productId } = useParams()
  const { data, error, isLoading } = useGetSingleProductQuery(String(productId))

  const reviewData = useGetReviewsByProductQuery(String(productId))

  useEffect(() => {
    if (error) {
      nav('/')
    }
  }, [error])

  const { isLoggedIn } = useSelector((state: AppState) => state.user)

  return (
    <div className='container mx-auto px-4 md:px-16 py-16'>
      {isLoading && <ShowLoading />}
      <div className='grid md:grid-cols-2 gap-8'>
        <div>{data && <ProductCarousel data={data} />}</div>
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
      <div>
        {' '}
        {reviewData.data && <ProductReview reviews={reviewData.data} />}
      </div>
    </div>
  )
}
