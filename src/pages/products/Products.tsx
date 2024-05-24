import { useState } from 'react'

import { useGetAllProductsQuery } from '../../services/product'
import { Feedback, Product } from '../../misc/type'
import ProductCard from '../../components/product/ProductCard'
import { PaginationNav } from '../../components/common/Pagination'
import SearchProduct from '../../components/product/SearchProduct'
import { QueryParams } from '../../misc/type'
import { ShowLoading } from '../../components/common/feedback'
import ProductReview from '../../components/product/ProductReview'

export default function Products({ feedback }: { feedback: Feedback }) {
  const [query, setQuery] = useState<QueryParams>([
    {
      type: 'startingAfter',
      value: '0'
    },
    {
      type: 'limit',
      value: '12'
    }
  ])

  const { data, error, isLoading } = useGetAllProductsQuery(query)
  if (error) {
    feedback.handleError(error)
  }

  return (
    <div className='grid justify-center gap-8'>
      {isLoading && <ShowLoading />}
      <SearchProduct setQuery={setQuery} />
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto justify-center'>
        {data &&
          data.map((product: Product) => {
            return (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            )
          })}
      </div>
      <PaginationNav setQuery={setQuery} />
    </div>
  )
}
