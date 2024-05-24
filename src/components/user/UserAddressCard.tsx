import { Address } from '../../misc/type'

export type UserAddressCardProps = {
  address: Address
}

export function UserAddressCard({ address }: UserAddressCardProps) {
  return (
    <div className='grid gap-8 py-4'>
      <div className='bg-gray-200 rounded-lg py-12 px-8 grid gap-4'>
        <div className='grid gap-4 '>
          <p className='text-gray-400'>
            <strong>Recepient</strong>
          </p>
          <p>{`${address.firstName} ${address.lastName}`}</p>
          <p className='text-gray-400'>
            <strong>Address</strong>
          </p>
          <p>{address.addressLine}</p>
          <p className='text-gray-400'>
            <strong>Country</strong>
          </p>
          <p>{address.country}</p>
          <p className='text-gray-400'>
            <strong>Contact</strong>
          </p>
          <p>{address.phoneNumber}</p>
        </div>
      </div>
    </div>
  )
}
