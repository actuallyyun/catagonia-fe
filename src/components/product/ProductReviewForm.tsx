import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'

import { Feedback, ReviewCreateDto, ReviewUserInput } from '../../misc/type'
import { useCreateReviewMutation } from '../../services/auth'

const createReviewSchema = Yup.object().shape({
  content: Yup.string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!')
    .required('Required'),
  rating: Yup.number().min(0).max(5).required(),
  isAnonymous: Yup.boolean().default(false)
})

export type CreateReviewFormProps = {
  feedback: Feedback
  productId: string
}

export default function CreateReviewForm({
  feedback,
  productId
}: CreateReviewFormProps) {
  const [creatReview] = useCreateReviewMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createReviewSchema)
  })

  const onSubmit = async (data: ReviewUserInput) => {
    try {
      const payload = await creatReview({
        ...data,
        productId: productId
      }).unwrap()

      if (payload) {
        feedback.handleSuccess('Review created successfully.')
        setTimeout(() => window.location.reload(), 2000)
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4 dark:text-gray-900'>
      <h4 className='dark:text-gray-800'>Write a review</h4>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-12'>
        <label htmlFor='isAnonymous' className='dark:text-gray-800'>
          Would you like to be anonymous
        </label>
        <select {...register('isAnonymous')}>
          <option value='false'>No</option>
          <option value='true'>Yes</option>
        </select>
        {errors.isAnonymous ? <div>{errors.isAnonymous.message}</div> : null}
        <label htmlFor='categoryId' className='dark:text-gray-800'>
          Choose a rating: from 0 to 5
        </label>
        <input type='number' {...register('rating', { min: 0, max: 5 })} />
        {errors.rating ? <div>{errors.rating.message}</div> : null}
        <label htmlFor='content' className='dark:text-gray-800'>
          Add your review
        </label>
        <textarea {...register('content')} />
        {errors.content ? <div>{errors.content.message}</div> : null}
        <Button type='submit' color='dark' size='lg' pill>
          Add
        </Button>
      </form>
    </div>
  )
}
