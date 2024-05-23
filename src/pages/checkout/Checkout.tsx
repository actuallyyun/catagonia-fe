import { useSelector } from 'react-redux'
import { Table } from 'flowbite-react'

import { selectAllItems } from '../../components/cart/cartSlice'
import { CartItem, Address } from '../../misc/type'
import { useGetUserAddressesQuery } from '../../services/auth'
import CreateAddressForm from '../../components/checkout/CreateAddressForm'
import { Feedback } from '../../misc/type'

export type OrderTableType = {
  order: CartItem[]
}

export type AddressCarrdType = {
  address: Address
}

export default function Checkout({ feedback }: { feedback: Feedback }) {
  const items = useSelector(selectAllItems)
  const { data, error } = useGetUserAddressesQuery()
  console.log({ data })

  return (
    <div className='grid gap-16'>
      <h3>Checkout</h3>
      <OrderTable order={items} />
      {data?.length === 0 && (
        <div className='grid gap-4'>
          <h3>You don't have addresses yet.</h3>
          <CreateAddressForm feedback={feedback} />
        </div>
      )}
    </div>
  )
}

export function AddressCard({ address }: AddressCarrdType) {
  return (
    <>
      <p>address </p>
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
