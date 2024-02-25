import { Link } from 'react-router-dom'

import { useGetCategoriesQuery } from '../../services/fakeStore'
import CategoryCard from './CategoryCard'
import styles from './category.module.css'

export default function CategoryList() {
  const { data, error, isLoading } = useGetCategoriesQuery()
  const categories = data
  return (
    <div className='px-4 md:px-16'>
      <h3>Shop by categories</h3>
      <div className={`${styles.categorySlider_layout} py-4 md:py-12`}>
        {categories &&
          categories.map((c) => (
            <Link
              to={`/category/${c.id}`}
              target='_blank'
              aria-describedby={c.name}
              key={c.name}
            >
              <CategoryCard category={c} />
            </Link>
          ))}
      </div>
    </div>
  )
}
