import { Carousel } from 'flowbite-react'
import { Product } from '../../misc/type'

export default function ProductCarousel({ data }: { data: Product }) {
  const images = data?.images.map((img) => img.imageUrl)
  console.log({ images })

  return (
    <div className='h-96'>
      <Carousel>
        {images &&
          images.map((img) => {
            return (
              <div className='flex h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white'>
                <img src={img} alt='product' key={img} />
              </div>
            )
          })}
      </Carousel>
    </div>
  )
}
