import { Product, ReviewReadDto } from '../../misc/type'
import { Card } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { Label, TextInput, Button } from 'flowbite-react'

export type ProductReviewProp = {
  reviews: ReviewReadDto[]
}

export default function ProductReview({ reviews }: ProductReviewProp) {
  console.log({ reviews })

  return (
    <div>
      <div className='grid md-grid-col-3'>
        <h2>Reviews</h2>
        {reviews.length === 0 && (
          <div>
            <h3>No reviews yet.</h3>
            <Button type='submit' gradientDuoTone='purpleToPink'>
              Write A Reivew
            </Button>
          </div>
        )}

        {reviews.length > 0 && (
          <div>
            <h3>Rating </h3>
            <p>Based on xx reviews</p>
            <div>
              <Button type='submit' gradientDuoTone='purpleToPink'>
                Write A Reivew
              </Button>
            </div>
            <p>{reviews.length} Reviews</p>
            <div>
              {reviews.map((review) => {
                return (
                  <div key={review.id}>
                    <ReviewCard review={review} />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export type ReviewCardProp = {
  review: ReviewReadDto
}
export function ReviewCard({ review }: ReviewCardProp) {
  return (
    <div className='grid grid-cols-12 gap-8'>
      <div className='grid-col-2'>
        {review.user && <img src={review.user.avatar} />}
      </div>
      <div className='grid-col-auto gap-4'>
        {review.user && (
          <p className='text-bold'>{`${review.user.firstName}  ${review.user.lastName}`}</p>
        )}
        <p>Rating:{review.rating}</p>
        <p className='text-md'>{review.content}</p>
        <p className='text-muted'>{review.createdAt}</p>
      </div>
    </div>
  )
}
