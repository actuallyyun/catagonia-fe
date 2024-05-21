import { Link } from 'react-router-dom'

import { useGetCategoriesQuery } from '../../services/product'
import CategoryCard from './CategoryCard'
import styles from './category.module.css'
import { ShowLoading, handleFetchBaseQueryError } from '../common/feedback'

export default function CategoryList() {
  const { data, error, isLoading } = useGetCategoriesQuery()
  const categories = data
  if (error) {
    return handleFetchBaseQueryError(error)
  }
  return (
    <div className='px-4 md:px-16'>
      <h3>Shop by categories</h3>
      {isLoading && <ShowLoading />}
      <div className={`${styles.categorySlider_layout} py-4 md:py-12`}>
        {categories &&
          categories.map((c) => (
            <Link
              to={`/shop/${c.id}`}
              target='_blank'
              key={c.name}
              aria-label={c.name}
              role='link'
            >
              <CategoryCard category={c} />
            </Link>
          ))}
      </div>
    </div>
  )
}
