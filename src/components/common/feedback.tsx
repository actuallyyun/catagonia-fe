import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { SerializedError } from '@reduxjs/toolkit'
import { Spinner } from 'flowbite-react'
import { Toast } from 'flowbite-react'
import { HiCheck, HiX } from 'react-icons/hi'

export const handleFetchBaseQueryError = (
  error: FetchBaseQueryError | SerializedError | null
) => {
  if (!error) {
    return null
  } else {
    if ('status' in error) {
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)
      return (
        <div className='grid gap-4 justify-center'>
          <p>An error has occurred.</p>
          <p>Message: {errMsg}</p>
          <p>Please come back later.</p>
        </div>
      )
    } else {
      return <p>An error has occurred:{error.message}</p>
    }
  }
}

export const ShowLoading = () => <Spinner />

type FeedbackType = {
  state: 'success' | 'failure'
  message: string
}
export const ShowFeedback = ({ state, message }: FeedbackType) => {
  return (
    <Toast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
        {state === 'success' && <HiCheck className='h-5 w-5' />}
        {state === 'failure' && <HiX className='h-5 w-5' />}
      </div>
      <div className='ml-3 text-sm font-normal'>{message}</div>
      <Toast.Toggle />
    </Toast>
  )
}

export type TooltipProps = {
  message: string
}
export function SuccessTooltip({ message }: TooltipProps) {
  return (
    <Toast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
        <HiCheck className='h-5 w-5' />
      </div>
      <div className='ml-3 text-sm font-normal'>{message}</div>
      <Toast.Toggle />
    </Toast>
  )
}

export function FailureTooltip({ message }: TooltipProps) {
  return (
    <Toast>
      <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200'>
        <HiX className='h-5 w-5' />
      </div>
      <div className='ml-3 text-sm font-normal'>{message}</div>
      <Toast.Toggle />
    </Toast>
  )
}