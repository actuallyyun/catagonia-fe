import { useSelector } from 'react-redux'
import { Table } from 'flowbite-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { selectAllItems } from '../../components/cart/cartSlice'
import { CartItem, Address, OrderCreateDto } from '../../misc/type'
import {
  useGetUserAddressesQuery,
  useCreateOrderMutation
} from '../../services/auth'
import CreateAddressForm from '../../components/checkout/CreateAddressForm'
import { Feedback } from '../../misc/type'
import { Button } from 'flowbite-react'

export type OrderTableType = {
  order: CartItem[]
}

export type AddressCardType = {
  address: Address
  setOrderAddress: React.Dispatch<React.SetStateAction<Address | null>>
  setShowOrderButton: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Checkout({ feedback }: { feedback: Feedback }) {
  const items = useSelector(selectAllItems)
  const { data, error } = useGetUserAddressesQuery()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [orderAddress, setOrderAddress] = useState<Address | null>(null)
  const [showOrderButton, setShowOrderButton] = useState(false)

  const handleShowCreate = () => {
    setShowCreateForm((prev) => (prev = !prev))
  }
  const [createOrder] = useCreateOrderMutation()
  const nagivate = useNavigate()

  const handleCreateOrder = async () => {
    const order: OrderCreateDto = {
      addressId: String(orderAddress?.id),
      orderItemCreateDto: items
    }

    try {
      const payload = await createOrder(order).unwrap()
      if (payload) {
        feedback.handleSuccess('Thank you for creating an order!')
        setTimeout(() => nagivate('/account'), 2000)
      } else {
        feedback.handleError('unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div className='grid gap-16'>
      <h3>Checkout</h3>
      <OrderTable order={items} />
      <div className={showOrderButton ? 'grid' : 'hidden'}>
        <div className='grid gap-4 mb-8'>
          <h4>Shipping Address</h4>
          <p>
            Recepient:{orderAddress?.firstName} {orderAddress?.lastName}
          </p>
          <p>
            To:{orderAddress?.addressLine} {orderAddress?.country}
          </p>
          <p>Postal Code:{orderAddress?.postalCode}</p>
          <p>Contact:{orderAddress?.phoneNumber} </p>
        </div>
        <Button color='dark' size='md' pill onClick={handleCreateOrder}>
          Place Order
        </Button>
      </div>
      {data?.length === 0 && (
        <div className='grid gap-4'>
          <h3>You don't have addresses yet.</h3>
        </div>
      )}
      <div className={showOrderButton ? 'hidden' : 'grid'}>
        {data &&
          data.length > 0 &&
          data.map((address: Address) => {
            return (
              <div key={address.id} className='grid grid-cols-2'>
                <AddressCard
                  address={address}
                  setOrderAddress={setOrderAddress}
                  setShowOrderButton={setShowOrderButton}
                />
              </div>
            )
          })}
      </div>
      <Button
        color='light'
        size='md'
        pill
        onClick={handleShowCreate}
        className={showOrderButton ? 'hidden' : 'grid'}
      >
        Create A New Address
      </Button>
      <div className={showCreateForm ? 'grid' : 'hidden'}>
        <CreateAddressForm feedback={feedback} />
      </div>
    </div>
  )
}

export function AddressCard({
  address,
  setOrderAddress,
  setShowOrderButton
}: AddressCardType) {
  const handleEdit = () => {}
  const handleSetAddress = (address: Address) => {
    setOrderAddress(address)
    setShowOrderButton((prev) => (prev = !prev))
  }

  return (
    <>
      <div className='grid gap-8'>
        <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
          <h4 className='dark:text-gray-800'>Address</h4>
          {address && (
            <div className='grid gap-4 '>
              <p className='text-gray-400'>
                <strong>FirstName</strong>
              </p>
              <p>{`${address.firstName} ${address.lastName}`}</p>
              <p className='text-gray-400'>
                <strong>Address Line</strong>
              </p>
              <p>{address.addressLine}</p>
              <p className='text-gray-400'>
                <strong>Postal Code</strong>
              </p>
              <p>{address.postalCode}</p>
              <p className='text-gray-400'>
                <strong>Country</strong>
              </p>
              <p>{address.country}</p>
              <p className='text-gray-400'>
                <strong>Phone Number</strong>
              </p>
              <p>{address.phoneNumber}</p>
              <Button
                onClick={() => handleSetAddress(address)}
                color='success'
                size='md'
                pill
              >
                Use This Address
              </Button>
              <Button onClick={() => handleEdit()} color='dark' size='md' pill>
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function OrderTable({ order }: OrderTableType) {
  return (
    <Table hoverable className=''>
      <Table.Head>
        <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          Product Id
        </Table.HeadCell>

        <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          Quantity
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {order?.map((order) => {
          return (
            <>
              {' '}
              <Table.Row
                className='bg-white dark:border-gray-700 dark:bg-gray-800'
                key={order.productId}
              >
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {order?.productId}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {order?.quantity}
                </Table.Cell>
              </Table.Row>
            </>
          )
        })}
      </Table.Body>
    </Table>
  )
}
