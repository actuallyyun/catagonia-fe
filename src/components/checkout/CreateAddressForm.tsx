import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from 'flowbite-react'

import { AddressCreateDto, Feedback } from '../../misc/type'
import { useCreateAddressMutation } from '../../services/auth'

const createAddressSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  addressLine: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  postalCode: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  country: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  phoneNumber: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required')
})

export default function CreateAddressForm({
  feedback
}: {
  feedback: Feedback
}) {
  const [creatAddress] = useCreateAddressMutation()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createAddressSchema)
  })
  const onSubmit = async (data: AddressCreateDto) => {
    try {
      const payload = await creatAddress(data).unwrap()
      if (payload) {
        feedback.handleSuccess('Address created successfully.')
        //setTimeout(() => navigate(`/product/${payload.id}`), 2000)
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }
  return (
    <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4 dark:text-gray-900'>
      <h4 className='dark:text-gray-800'>Create a new address</h4>
      <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-12'>
        <label htmlFor='firstName' className='dark:text-gray-800'>
          FirstName
        </label>
        <input {...register('firstName')} />
        {errors.firstName ? <div>{errors.firstName.message}</div> : null}
        <label htmlFor='lastName' className='dark:text-gray-800'>
          LastName
        </label>
        <input {...register('lastName')} />
        <label htmlFor='addressLine' className='dark:text-gray-800'>
          AddressLine
        </label>
        <input {...register('addressLine')} />
        {errors.addressLine ? <div>{errors.addressLine.message}</div> : null}
        <label htmlFor='country' className='dark:text-gray-800'>
          Country
        </label>
        <input {...register('country')} />
        {errors.country ? <div>{errors.country.message}</div> : null}
        <label htmlFor='postalCode' className='dark:text-gray-800'>
          PostalCode
        </label>
        <textarea {...register('postalCode')} />
        {errors.postalCode ? <div>{errors.postalCode.message}</div> : null}

        <label htmlFor='phoneNumber' className='dark:text-gray-800'>
          PhoneNumber
        </label>
        <textarea {...register('phoneNumber')} />
        {errors.phoneNumber ? <div>{errors.phoneNumber.message}</div> : null}

        <Button type='submit' color='dark' size='lg' pill>
          Create
        </Button>
      </form>
    </div>
  )
}
