import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'flowbite-react'

import { logOut, selectCurrentUser } from '../../components/user/userSlice'
import CreateProductForm from '../../components/product/CreateProductForm'
import { Feedback, OrderReadDto } from '../../misc/type'
import { useNavigate } from 'react-router-dom'
import { useGetUserOrdersQuery } from '../../services/auth'

export default function Profile({ feedback }: { feedback: Feedback }) {
  const currentUser = useSelector(selectCurrentUser)
  const { data, error, isLoading } = useGetUserOrdersQuery()

  const dispatch = useDispatch()
  var redirect = useNavigate()

  const handleLogOut = () => {
    dispatch(logOut())
    feedback.handleSuccess('You are logged out.')
    redirect('/')
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className='w-11/12 m-auto'>
      <div className='grid grid-cols-2 justify-center gap-4 pt-4'>
        <div>
          <h3 className='text-center'>Account</h3>
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
                  <Button onClick={handleLogOut} color='dark' size='lg' pill>
                    Log out
                  </Button>
                </div>
              )}
            </div>
            {currentUser.role === 1 && (
              <CreateProductForm feedback={feedback} />
            )}
          </div>
        </div>
        <div>
          {' '}
          <h3 className='text-center'>Order</h3>
          {data?.length === 0 && <p>You don't have any orders.</p>}
          {data &&
            data.length > 0 &&
            data.map((order) => {
              return (
                <div>
                  <OrderDetailCard order={order} />
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}

export type OrderDetailCardProps = {
  order: OrderReadDto
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  return (
    <div className='grid gap-8'>
      <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
        <h4 className='dark:text-gray-800'>order detail</h4>
        {order && (
          <div className='grid gap-4 '>
            <p className='text-gray-400'>
              <strong>Product</strong>
            </p>
            {order.orderItems.map((item) => {
              return <p>{`${item.productId} ${item.quantity} ${item.price}`}</p>
            })}
            <p className='text-gray-400'>
              <strong>Status</strong>
            </p>
            <p>{order.status}</p>
            <p className='text-gray-400'>
              <strong>Shipped To</strong>
            </p>
            <p>{order.address.addressLine}</p>
            <p className='text-gray-400'>
              <strong>Created At</strong>
            </p>
            <p>{order.createdAt}</p>
          </div>
        )}
      </div>
    </div>
  )
}
