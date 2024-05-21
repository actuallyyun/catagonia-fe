import { useParams } from 'react-router-dom'

import { useGetProductsByCategoryQuery } from '../../services/product'
import ProductCard from '../../components/product/ProductCard'
import SortByPrice from '../../components/category/SortByPrice'
import { useSelector } from 'react-redux'
import { AppState } from '../../app/store'
import { Feedback } from '../../misc/type'
import {
  ShowLoading,
  handleFetchBaseQueryError
} from '../../components/common/feedback'

export default function CategoryPage({ feedback }: { feedback: Feedback }) {
  const { categoryId } = useParams()
  const sortBy = useSelector((state: AppState) => state.category.sortBy)

  const { data, error, isLoading } = useGetProductsByCategoryQuery({
    categoryId: String(categoryId),
    sortBy
  })
  if (error) {
    return handleFetchBaseQueryError(error)
  }

  return (
    <div className='container mx-auto px-4 md:px-16 py-8'>
      {isLoading && <ShowLoading />}
      {data && (
        <div className='grid gap-4'>
          {
            <div className='grid gap-2'>
              <h2>{data[0].category.name}</h2>
              <p>{data.length} Items</p>
            </div>
          }
          <div className='justify-start'>
            <SortByPrice />
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto items-center justify-center'>
            {data?.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
