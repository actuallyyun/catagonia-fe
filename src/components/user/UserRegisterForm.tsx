import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigate } from 'react-router-dom'
import { Label, TextInput, Button } from 'flowbite-react'
import { useState } from 'react'

import { Feedback, UserTextInput } from '../../misc/type'
import { useRegisterMutation } from '../../services/auth'
import { useUploadFileMutation } from '../../services/file'

const defaultImage = 'https://picsum.photos/id/237/200/200'

const SignupSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  lastname: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters')
    .max(16, 'Must be shorter than 16 characters')
    .required('Required')
})

const UserRegisterForm = ({ feedback }: { feedback: Feedback }) => {
  const nagivate = useNavigate()
  const [addUser] = useRegisterMutation()
  const { handleError, handleSuccess } = feedback
  const [uploadFile] = useUploadFileMutation()
  const [file, setFile] = useState<File | null>(null)

  const handleUploadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null
    setFile((prev) => (prev = uploadedFile))
  }

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(SignupSchema)
  })
  const onSubmit = async (data: UserTextInput) => {
    let avatar: string = ''
    if (file) {
      try {
        const fileResponse = await uploadFile(file).unwrap()
        avatar = fileResponse.location
        feedback.handleSuccess('Image uploaded successfully.')
      } catch (error) {
        feedback.handleError('File upload failed. We will find you a image.')
        avatar = defaultImage
      }
    }
    try {
      const payload = await addUser({ ...data, avatar: avatar }).unwrap()
      if (payload) {
        handleSuccess('Thank you for creating an account!')
        setTimeout(() => nagivate('/account'), 2000)
      } else {
        handleError('unkown error')
      }
    } catch (err) {
      handleError(err)
    }
  }

  return (
    <div className='grid gap-8'>
      <h1>Create an Account.</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='grid'>
        <Label htmlFor='firstname' value='Firstname' />
        <TextInput
          {...register('firstname')}
          placeholder='Firstname'
          color={errors.firstname ? 'failure' : ''}
          helperText={
            <>
              {errors.firstname && (
                <span className='font-medium'>{errors.firstname.message}</span>
              )}
            </>
          }
        />
        <Label htmlFor='lastname' value='Lastname' />
        <TextInput
          {...register('lastname')}
          placeholder='Lastname'
          color={errors.lastname ? 'failure' : ''}
          helperText={
            <>
              {errors.lastname && (
                <span className='font-medium'>{errors.lastname.message}</span>
              )}
            </>
          }
        />
        <Label htmlFor='email' value='Email' />
        <TextInput
          {...register('email')}
          placeholder='email'
          color={errors.email ? 'failure' : ''}
          helperText={
            <>
              {errors.email && (
                <span className='font-medium'>{errors.email.message}</span>
              )}
            </>
          }
        />
        <Label htmlFor='password' value='password' />
        <TextInput
          {...register('password')}
          placeholder='password'
          color={errors.password ? 'failure' : ''}
          helperText={
            <>
              {errors.password && (
                <span className='font-medium'>{errors.password.message}</span>
              )}
            </>
          }
        />
        <Label htmlFor='avatar' value='avatar' />
        <input onChange={handleUploadFile} type='file' />
        <p>
          Please read our Privacy Notice for how we process your personal data
          and how you can exercise your privacy rights.
        </p>
        <Button type='submit' gradientDuoTone='purpleToPink'>
          Create Account
        </Button>
      </form>
    </div>
  )
}

export default UserRegisterForm
