import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Table } from 'flowbite-react'

import ClearCart from '../../components/cart/ClearCart'
import { selectAllItems, updateQuantity } from '../../components/cart/cartSlice'
import { CartItem } from '../../misc/type'
import { useGetSingleProductQuery } from '../../services/product'
import { removeItem } from '../../components/cart/cartSlice'

export type CartItemProp = {
  item: CartItem
}
export const CartItemCard = ({ item }: CartItemProp) => {
  const [quantity, setQuantity] = useState<number>(item.quantity)
  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuantity((prev) => (prev = parseInt(e.target.value)))
  }
  const dispatch = useDispatch()
  const handleUpdate = (id: string) => {
    dispatch(
      updateQuantity({
        productId: id,
        quantity: quantity
      })
    )
  }
  const { data, error } = useGetSingleProductQuery(item.productId)

  if (error) {
    return null
  }

  const handleRemove = (id: string) => {
    dispatch(removeItem(id))
  }

  return (
    <>
      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          {data?.title}
        </Table.Cell>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          {data?.category.name}
        </Table.Cell>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          ${data?.price}
        </Table.Cell>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          <input
            type='number'
            value={quantity}
            max={10}
            min={1}
            onChange={handleQuantityChange}
            name={data?.title}
          />
        </Table.Cell>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          <button
            onClick={() => handleUpdate(item.productId)}
            className='text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
          >
            Update
          </button>
          <button onClick={() => handleRemove(item.productId)}>Remove</button>
        </Table.Cell>
      </Table.Row>
    </>
  )
}

export default function Cart() {
  const items = useSelector(selectAllItems)
  return (
    <div className='container mx-auto px-4 md:px-16 py-16'>
      <div className='overflow-x-auto '>
        {!items.length && (
          <p className='dark:text-white'>Your cart is empty.</p>
        )}
        {items.length ? (
          <Table hoverable className=''>
            <Table.Head>
              <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                Product name
              </Table.HeadCell>
              <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                Category
              </Table.HeadCell>
              <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                Price
              </Table.HeadCell>
              <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                Quantity
              </Table.HeadCell>
              <Table.HeadCell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                <span className='sr-only'>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            <Table.Body className='divide-y'>
              {items.length &&
                items.map((item) => {
                  return <CartItemCard item={item} key={item.productId} />
                })}
            </Table.Body>
          </Table>
        ) : null}
        <div className='container py-6 w-9/12'>
          <div className='grid md:grid-cols-3 gap-4'>
            {items.length ? <ClearCart /> : null}
            <Link
              to='/'
              className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
            >
              Continue Shopping
            </Link>
            {items.length ? (
              <Link to={`/checkout`}>
                <button
                  type='button'
                  className='text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2'
                >
                  Checkout
                </button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}


