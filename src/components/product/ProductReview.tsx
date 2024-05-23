import { useDispatch, useSelector } from 'react-redux'

import { Product, ReviewReadDto } from '../../misc/type'
import { Button } from 'flowbite-react'
import { Rating } from 'flowbite-react'
import CreateReviewForm from './ProductReviewForm'
import { useState } from 'react'
import { Feedback, UserInfo } from '../../misc/type'
import { UpdateReviewForm } from './UpdateProductReviewForm'
import { selectCurrentUser } from '../../components/user/userSlice'
import { useDeleteReviewMutation } from '../../services/auth'

export type ProductReviewProp = {
  reviews: ReviewReadDto[]
  product: Product
  feedback: Feedback
}

export default function ProductReview({
  reviews,
  product,
  feedback
}: ProductReviewProp) {
  console.log({ reviews })
  const [showReviewForm, setShowReviewForm] = useState(false)
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div>
      <div className='grid gap-6'>
        <h2>Reviews</h2>
        {reviews.length === 0 && (
          <div>
            <h3>No reviews yet.</h3>
          </div>
        )}
        <div className={showReviewForm ? 'hidden' : 'grid'}>
          <Button
            onClick={() => setShowReviewForm(true)}
            type='submit'
            gradientDuoTone='purpleToPink'
          >
            Write A Reivew
          </Button>
        </div>
        <div className={showReviewForm ? 'grid' : 'hidden'}>
          <CreateReviewForm feedback={feedback} productId={product.id} />
        </div>
        {reviews.length > 0 && (
          <div className='grid gap-6'>
            <div className='flex flex-row gap-6'>
              <h3>Rating:</h3>
              <ProductRating rating={product.rating} size='lg' />
            </div>
            <p>Based on {reviews.length} reviews</p>

            <p>{reviews.length} Reviews</p>
            <div>
              {reviews.map((review) => {
                return (
                  <div key={review.id}>
                    <ReviewCard
                      review={review}
                      user={currentUser}
                      feedback={feedback}
                    />
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
  user: UserInfo | null
  feedback: Feedback
}
export function ReviewCard({ review, user, feedback }: ReviewCardProp) {
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const isOwnerOrAdmin =
    user && (user.role === 1 || review?.user.id === user.id)

  const [deleteReview] = useDeleteReviewMutation()
  const handleDelete = async (id: string) => {
    try {
      const payload = await deleteReview({
        id: id
      })
      if (payload) {
        feedback.handleSuccess('Delete review successfully.')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div>
      {!showUpdateForm && (
        <>
          <div className='grid grid-cols-12 gap-8 divide-y divide-dashed my-'>
            <div className='col-span-2'>
              {review.user && <img src={review.user.avatar} />}
            </div>
            <div className='col-start-3 col-span-8 gap-8 grid'>
              {review.user && (
                <p className='font-bold'>{`${review.user.firstName}  ${review.user.lastName}`}</p>
              )}
              <div className='flex flex-row gap-4'>
                <p className=''>Rating:</p>
                <ProductRating size='sm' rating={review.rating} />
              </div>
              <p className='text-md'>{review.content}</p>
              <p className='text-gray-500'>Reviewed on:{review.createdAt}</p>
            </div>
          </div>
          <div className={isOwnerOrAdmin ? 'grid' : 'hidden'}>
            <div className='flex flex-row gap-8 my-12 justify-center'>
              <Button color='gray' onClick={() => setShowUpdateForm(true)}>
                Update
              </Button>
              <Button color='dark' onClick={() => handleDelete(review.id)}>
                Delete
              </Button>
            </div>
          </div>
        </>
      )}
      {showUpdateForm && (
        <UpdateReviewForm review={review} feedback={feedback} />
      )}
    </div>
  )
}

export type ProductRatingProps = {
  rating: number
  size: 'lg' | 'md' | 'sm'
}

export function ProductRating({ rating, size }: ProductRatingProps) {
  const star = new Array(rating).fill(0)
  const filled = new Array(5 - rating).fill(0)
  return (
    <Rating size={size} key={rating}>
      {star.map((s) => (
        <Rating.Star />
      ))}
      {filled.map((f) => (
        <Rating.Star filled={false} />
      ))}
    </Rating>
  )
}
