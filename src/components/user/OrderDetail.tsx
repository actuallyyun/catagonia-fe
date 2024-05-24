import { Accordion } from 'flowbite-react'

import { OrderReadDto } from '../../misc/type'
import { parseOrderStatus } from '../../misc/utils'

export type OrderAccordionProps = {
  orders: OrderReadDto[]
}
export function OrderAccordion({ orders }: OrderAccordionProps) {
  return (
    <Accordion collapseAll>
      {orders.map((order: OrderReadDto, index: number) => {
        return (
          <Accordion.Panel>
            <Accordion.Title key={order.id}>
              Order No.{index + 1} Status: {parseOrderStatus(order.status)}
            </Accordion.Title>
            <Accordion.Content>
              <OrderDetailCard order={order} />
            </Accordion.Content>
          </Accordion.Panel>
        )
      })}
    </Accordion>
  )
}

export function OrderTable() {}

export type OrderDetailCardProps = {
  order: OrderReadDto
}

export function OrderDetailCard({ order }: OrderDetailCardProps) {
  return (
    <div className='grid gap-8'>
      <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
        <h4 className='dark:text-gray-800'>Order detail</h4>
        {order && (
          <div className='grid gap-4 '>
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
