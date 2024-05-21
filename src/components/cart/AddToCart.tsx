import { useDispatch } from 'react-redux'
import { Button } from 'flowbite-react'
import { Modal, Table } from 'flowbite-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

import { addItem, selectAllItems } from './cartSlice'
import { useGetSingleProductQuery } from '../../services/product'
import { CartItemProp } from '../../pages/cart/Cart'

type Props = {
  id: string
}

export type ModalProps = {
  openModal: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}
export function CartModal({ openModal, setOpenModal }: ModalProps) {
  const items = useSelector(selectAllItems)
  return (
    <>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Your Shopping Cart</Modal.Header>
        <Modal.Body>
          <div className='space-y-6'>
            <Table hoverable className=''>
              <Table.Head>
                <Table.HeadCell>Product </Table.HeadCell>
                <Table.HeadCell>Quantity</Table.HeadCell>
                <Table.HeadCell>Price</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {items &&
                  items.map((item) => {
                    return <CartItemCard item={item} />
                  })}
              </Table.Body>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>Continue Shopping</Button>
          <a href='/cart'>
            <Button color='purple' onClick={() => setOpenModal(false)}>
              Checkout
            </Button>
          </a>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const CartItemCard = ({ item }: CartItemProp) => {
  const { data } = useGetSingleProductQuery(item.productId)

  return (
    <>
      <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
        <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
          {data?.title}
        </Table.Cell>
        <Table.Cell>{item?.quantity}</Table.Cell>
        <Table.Cell>${data?.price}</Table.Cell>
      </Table.Row>
    </>
  )
}

export default function AddToCart({ id }: Props) {
  const [quantity, setQuantity] = useState<number>(1)
  const [openModal, setOpenModal] = useState(false)

  const dispath = useDispatch()

  const handleClick = (id: string) => {
    dispath(addItem({ productId: id, quantity: quantity }))
    setOpenModal(true)
  }
  return (
    <div className='flex flex-row gap-2 md:gap-4'>
      <input
        type='number'
        value={quantity}
        min={1}
        max={10}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <Button
        onClick={() => handleClick(id)}
        color='dark'
        pill
        className='text-nowrap'
      >
        Quick Add
      </Button>
      <CartModal openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  )
}


