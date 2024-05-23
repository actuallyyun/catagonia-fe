import { useState } from 'react'

import UserRegisterForm from '../../components/user/UserRegisterForm'
import UserLoginForm from '../../components/user/UserLoginForm'
import LogInWithGoogle from '../../components/user/LoginWithGoogle'
import { Feedback } from '../../misc/type'

export default function Auth({ feedback }: { feedback: Feedback }) {
  const [hideLogin, setHideLogin] = useState('')
  const [hideSignUp, setHideSignUp] = useState('hidden')

  const handleClick = () => {
    setHideLogin((_pre) => (_pre = 'hidden'))
    setHideSignUp((_pre) => (_pre = ''))
  }
  const goSignin = () => {
    setHideLogin((_pre) => (_pre = ''))
    setHideSignUp((_pre) => (_pre = 'hidden'))
  }
  return (
    <div className='container mt-10'>
      <div className='grid gap-8 w-11/12 md:w-1/2 m-auto'>
        <div className={`grid gap-4 items-center ${hideLogin}`}>
          <UserLoginForm feedback={feedback} />
          <div className='flex justify-start flex-col items-start'>
            <p>Don’t have an account?</p>
            <button
              type='button'
              onClick={handleClick}
              className='underline  underline-offset-8'
            >
              Create One Now
            </button>
          </div>
        </div>
        <div className={`grid gap-4 items-center ${hideSignUp}`}>
          <UserRegisterForm feedback={feedback} />
          <div className='flex justify-start flex-col items-start'>
            <p>Already have an account?</p>
            <button
              type='button'
              onClick={goSignin}
              className='underline  underline-offset-8'
            >
              Log In Now
            </button>
          </div>
        </div>
        <LogInWithGoogle feedback={feedback} />
      </div>
    </div>
  )
}
