import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { Button } from 'flowbite-react'
import { useState } from 'react'

import { CreateProductInput, Feedback } from '../../misc/type'
import {
  useGetCategoriesQuery,
  useCreateProductMutation
} from '../../services/product'
import { useUploadFileMutation } from '../../services/file'
import { useSelector } from 'react-redux'
import { selectAllCategories } from '../category/categorySlice'

const defaultImage = ['https://picsum.photos/id/237/400/600']

const createProductSchema = Yup.object().shape({
  title: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  price: Yup.number().min(1).max(1000).required(),
  inventory: Yup.number().min(1).max(1000).required(),
  description: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .max(200)
    .required('Required'),
  categoryId: Yup.number().min(1).required()
})

export default function CreateProductForm({
  feedback
}: {
  feedback: Feedback
}) {
  useGetCategoriesQuery()
  const categories = useSelector(selectAllCategories)
  const [file, setFile] = useState<null | File>(null)

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null
    setFile((prev) => (prev = uploadedFile))
  }
  const navigate = useNavigate()
  const [creatProduct] = useCreateProductMutation()
  const [uploadFile] = useUploadFileMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createProductSchema)
  })
  const onSubmit = async (data: CreateProductInput) => {
    try {
      let images: string[] = []

      if (file) {
        try {
          const fileResponse = await uploadFile(file).unwrap()
          images.push(fileResponse.location)
          feedback.handleSuccess('Image uploaded successfully.')
        } catch (error) {
          feedback.handleError('File upload failed. We will find you a image.')
          images = [...defaultImage]
        }
      }

      const payload = await creatProduct({ ...data, images: images }).unwrap()
      if (payload) {
        feedback.handleSuccess('Product created successfully.')
        setTimeout(() => navigate(`/product/${payload.id}`), 2000)
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }
  return (
    <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4 dark:text-gray-900'>
      <h4 className='dark:text-gray-800'>Create a new product</h4>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-12'>
        <label htmlFor='title' className='dark:text-gray-800'>
          Title
        </label>
        <input {...register('title')} />
        {errors.title ? <div>{errors.title.message}</div> : null}
        <label htmlFor='price' className='dark:text-gray-800'>
          Price
        </label>
        <input {...register('price')} />
        <label htmlFor='inventory' className='dark:text-gray-800'>
          Inventory
        </label>
        <input {...register('inventory')} />
        {errors.price ? <div>{errors.price.message}</div> : null}
        <label htmlFor='categoryId' className='dark:text-gray-800'>
          Choose a category
        </label>
        <select {...register('categoryId')}>
          {categories &&
            categories.map((cat) => {
              return (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              )
            })}
        </select>
        {errors.categoryId ? <div>{errors.categoryId.message}</div> : null}
        <label htmlFor='description' className='dark:text-gray-800'>
          Add a description
        </label>
        <textarea {...register('description')} />
        {errors.description ? <div>{errors.description.message}</div> : null}
        <input type='file' onChange={handleUploadFile} />
        <Button type='submit' color='dark' size='lg' pill>
          Create
        </Button>
      </form>
    </div>
  )
}
