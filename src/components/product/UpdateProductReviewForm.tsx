import { Button } from 'flowbite-react'
import { useForm } from 'react-hook-form'

import { ReviewReadDto, Feedback, ReviewUserInput } from '../../misc/type'
import { useUpdateReviewMutation } from '../../services/auth'

export type UpdateReviewFormProps = {
  review: ReviewReadDto
  feedback: Feedback
}

export function UpdateReviewForm({ review, feedback }: UpdateReviewFormProps) {
  const { register, handleSubmit } = useForm<ReviewUserInput>({
    defaultValues: {
      isAnonymous: review.isAnonymous,
      content: review.content,
      rating: review.rating
    }
  })
  const [updateReview] = useUpdateReviewMutation()

  const onSubmit = async (reviewInput: ReviewUserInput) => {
    try {
      const payload = await updateReview({
        ...reviewInput,
        reviewId: review.id
      })
      if (payload) {
        feedback.handleSuccess('Update product successfully.')
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div className='grid gap-4 bg-gray-200 rounded-lg py-12 px-8'>
      <h4>Update review</h4>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
        <div className='flex gap-4 items-center'>
          <label>Content</label>
          <input {...register('content')} />
        </div>
        <div className='flex gap-4 items-center'>
          <label htmlFor='isAnonymous' className='dark:text-gray-800'>
            Change anonymous setting
          </label>
          <select {...register('isAnonymous')}>
            <option value='false'>No</option>
            <option value='true'>Yes</option>
          </select>
        </div>
        <div className='flex gap-4 items-center'>
          <label htmlFor='categoryId' className='dark:text-gray-800'>
            Change the rating: from 0 to 5
          </label>
          <input type='number' {...register('rating', { min: 0, max: 5 })} />
        </div>
        <Button type='submit' color='success' pill>
          Update
        </Button>
      </form>
    </div>
  )
}
