import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'

import { logOut, selectCurrentUser } from '../../components/user/userSlice'
import CreateProductForm from '../../components/product/CreateProductForm'
import { Feedback } from '../../misc/type'
import { useNavigate } from 'react-router-dom'
import {
  useGetUserOrdersQuery,
  useGetUserAddressesQuery
} from '../../services/auth'
import { UpdateProfileForm } from '../../components/user/UserUpdateForm'
import { OrderAccordion } from '../../components/user/OrderDetail'
import { ProfileCard } from '../../components/user/UserProfileCard'
import { UserAddressCard } from '../../components/user/UserAddressCard'

export default function Profile({ feedback }: { feedback: Feedback }) {
  const currentUser = useSelector(selectCurrentUser)
  const { data, error, isLoading } = useGetUserOrdersQuery()
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const addressRes = useGetUserAddressesQuery()

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
      <div className='grid gap-4 py-4'>
        <h3>Orders</h3>

        {data?.length === 0 && <p>You don't have any orders.</p>}
        {data && <OrderAccordion orders={data} />}
      </div>
      <div className='grid grid-cols-2 justify-center gap-4 pt-4'>
        <div className=''>
          <h3 className='text-center'>Account</h3>
          <div className='py-4'>
            {!showUpdateForm && (
              <ProfileCard
                currentUser={currentUser}
                handleLogOut={handleLogOut}
                setShowUpdateForm={setShowUpdateForm}
              />
            )}
          </div>
          <div className='py-4'>
            {showUpdateForm && (
              <UpdateProfileForm
                feedback={feedback}
                currentUser={currentUser}
              />
            )}
          </div>
          <div className='py-4'>
            {currentUser.role === 1 && (
              <CreateProductForm feedback={feedback} />
            )}
          </div>
        </div>
        <div className=''>
          <h3 className='text-center'>Addresses</h3>
          {addressRes.data &&
            addressRes.data.map((address) => (
              <UserAddressCard address={address} />
            ))}
        </div>
      </div>
    </div>
  )
}
