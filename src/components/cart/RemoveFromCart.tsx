import { useDispatch } from 'react-redux'

import { removeItem } from './cartSlice'

type Props = {
  id: string
}
export default function RemoveFromCart({ id }: Props) {
  const dispath = useDispatch()

  const handleClick = (id: string) => {
    dispath(removeItem(id))
  }
  return (
    <>
      <button onClick={() => handleClick(id)}>Remove Item</button>
    </>
  )
}
