import { Product } from '../../misc/type'
import { Card } from 'flowbite-react'
import { Link } from 'react-router-dom'

import AddToCart from '../cart/AddToCart'
import { cleanImageUrl, generateRandomImage } from '../../misc/utils'

export type ProductCardProp = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProp) {
  const images = product.images.map((img) => img.imageUrl)


  return (
    <>
      <Card
        className='max-w-sm'
        imgAlt='Apple Watch Series 7 in colors pink, silver, and black'
        imgSrc={images.length === 0 ? generateRandomImage() : images[0]}
      >
        <Link to={`/product/${product.id}`} target='_blank'>
          <h5 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
            {product.title}
          </h5>
        </Link>
        <span className='text-3xl font-bold text-gray-900 dark:text-white'>
          ${product.price}
        </span>
        <AddToCart id={product.id} />
      </Card>
    </>
  )
}




