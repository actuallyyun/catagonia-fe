import { Button } from 'flowbite-react'

import { useDeleteProductMutation } from '../../services/product'
import { Feedback } from '../../misc/type'

const RemoveProduct = ({
  id,
  feedback
}: {
  id: string
  feedback: Feedback
}) => {
  const [deleteProduct] = useDeleteProductMutation()
  const handleRemove = async (id: string) => {
    try {
      const payload = await deleteProduct(id).unwrap()
      if (payload) {
        feedback.handleSuccess('Product delete successfully.')
      } else {
        feedback.handleError('Unkown error')
      }
    } catch (err) {
      feedback.handleError(err)
    }
  }

  return (
    <div className='grid gap-4  bg-gray-200 rounded-lg py-12 px-8'>
      <h4>Remove product</h4>
      <p>
        Once the product is removed, you will not be able to access it any more.
      </p>

      <Button onClick={() => handleRemove(id)} color='warning' pill>
        Remove
      </Button>
    </div>
  )
}

export default RemoveProduct
