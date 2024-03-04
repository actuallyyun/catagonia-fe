import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { Button } from 'flowbite-react'

import { Feedback, Product, UpdateProductInput } from '../../misc/type'
import { useUpdateProductMutation } from '../../services/product'
import { isAdmin } from '../user/userSlice'

type UpdateProductFormProp = {
  product: Product
  feedback: Feedback
}

export default function UpdateProductForm({
  product,
  feedback
}: UpdateProductFormProp) {
  const admin = useSelector(isAdmin)
  const { register, handleSubmit } = useForm<UpdateProductInput>({
    defaultValues: {
      title: product.title,
      price: product.price
    }
  })
  const [updateProduct] = useUpdateProductMutation()

  const onSubmit = async (productInput: UpdateProductInput) => {
    try {
      const payload = await updateProduct({
        ...productInput,
        id: product.id
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
    <>
      {admin && (
        <div className='grid gap-4 bg-gray-200 rounded-lg py-12 px-8'>
          <h4>Update product</h4>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
            <div className='flex gap-4 items-center'>
              <label>Title</label>
              <input {...register('title')} />
            </div>
            <div className='flex gap-4 items-center'>
              <label>Price</label>
              <input {...register('price')} type='number' />
            </div>
            <Button type='submit' color='success' pill>
              Update
            </Button>
          </form>
        </div>
      )}
    </>
  )
}
