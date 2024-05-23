import { useForm } from 'react-hook-form'
import { Feedback, UserInfo, UserUpdateInput } from '../../misc/type'
import { useState } from 'react'
import { storage } from '../../services/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { useUpdateUserMutation } from '../../services/auth'
import { Button } from 'flowbite-react'

export type UpdateProfileForm = {
  feedback: Feedback
  currentUser: UserInfo
}
export function UpdateProfileForm({
  feedback,
  currentUser
}: UpdateProfileForm) {
  const { register, handleSubmit } = useForm<UserUpdateInput>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      password: '*****************',
      avatar: currentUser.avatar
    }
  })
  const [file, setFile] = useState<File | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null
    setFile((prev) => (prev = uploadedFile))
  }

  const uploadFileCallBack = async (file: File): Promise<string> => {
    const postImgRef = ref(storage, `users/{file.name}`)
    const snapshot = await uploadBytesResumable(postImgRef, file)
    return await getDownloadURL(snapshot.ref)
  }

  const [updateUser] = useUpdateUserMutation()

  const onSubmit = async (userInput: UserUpdateInput) => {
    let newAvatar: string = ''
    if (file) {
      try {
        const imageUrl = await uploadFileCallBack(file)
        newAvatar = imageUrl
        feedback.handleSuccess('Image uploaded successfully.')
      } catch (error) {
        feedback.handleError('File upload failed. We will find you a image.')
        newAvatar = currentUser.avatar
      }
    }
    try {
      userInput.avatar = newAvatar
      const payload = await updateUser(userInput)
      if (payload) {
        feedback.handleSuccess('Update profile successfully.')
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div className='grid gap-8'>
      <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className='dark:text-gray-800'>Profile</h4>

          <div className='grid gap-4 '>
            <p className='text-gray-400'>
              <strong>First Name</strong>
            </p>
            <input {...register('firstName')} />
            <p className='text-gray-400'>
              <strong>Last Name</strong>
            </p>
            <input {...register('lastName')} />
            <p className='text-gray-400'>
              <strong>Password</strong>
            </p>
            <input {...register('password')} />
            <p className='text-gray-400'>
              <strong>Password</strong>
            </p>
            <input
              {...register('avatar')}
              type='file'
              onChange={handleFileUpload}
            />
            <div className='grid gap-8 my-8'>
              <Button color='dark' size='lg' pill type='submit'>
                Update
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
