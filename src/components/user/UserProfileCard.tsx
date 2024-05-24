import { Button } from 'flowbite-react'

import { Feedback, UserInfo } from '../../misc/type'

export type ProfileCardProps = {
  currentUser: UserInfo
  handleLogOut: () => void
  setShowUpdateForm: React.Dispatch<React.SetStateAction<boolean>>
}

export function ProfileCard({
  currentUser,
  handleLogOut,
  setShowUpdateForm
}: ProfileCardProps) {
  return (
    <div className='grid gap-8'>
      <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
        <h4 className='dark:text-gray-800'>Profile</h4>
        {currentUser && (
          <div className='grid gap-4 '>
            <p className='text-gray-400'>
              <strong>Name</strong>
            </p>
            <p>{`${currentUser.firstName} ${currentUser.lastName}`}</p>
            <p className='text-gray-400'>
              <strong>Email</strong>
            </p>
            <p>{currentUser.email}</p>
            <p className='text-gray-400'>
              <strong>Password</strong>
            </p>
            <p>********</p>
            <div className='grid gap-8 my-8'>
              <Button onClick={handleLogOut} color='dark' size='lg' pill>
                Log out
              </Button>
              <Button
                onClick={() => setShowUpdateForm(true)}
                color='dark'
                size='lg'
                pill
              >
                Update
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
