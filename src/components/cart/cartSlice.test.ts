import cartReducer, {
  InitialState,
  addItem,
  removeItem,
  updateQuantity,
  clearCart
} from './cartSlice'
import { CartItem } from '../../misc/type'

const initialState: InitialState = {
  items: []
}

describe('cart reducer', () => {
  let mockItems: CartItem[]
  beforeEach(() => {
    mockItems = [
      { productId: '1', quantity: 10 },
      { productId: '2', quantity: 2 }
    ]
  })

  test('should return initial state', () => {
    const state = cartReducer(undefined, { type: '' })
    expect(state).toEqual(initialState)
  })
  test('should return mock items', () => {
    const state = cartReducer({ items: mockItems }, { type: '' })
    expect(state.items).toEqual(mockItems)
  })
  test('addItem: should add new item', () => {
    const newItem = { productId: '3', quantity: 3 }
    const state = cartReducer({ items: mockItems }, addItem(newItem))
    mockItems.push(newItem)
    expect(state.items).toEqual(mockItems)
  })
  test('addItem: should update existing item', () => {
    const newItem = { productId: '2', quantity: 3 }
    const state = cartReducer({ items: mockItems }, addItem(newItem))
    mockItems = [
      { productId: '1', quantity: 10 },
      { productId: '2', quantity: 5 }
    ]
    expect(state.items).toEqual(mockItems)
  })
  test('updateQuantity: should update existing item', () => {
    const updateItem = { productId: '2', quantity: 3 }
    const state = cartReducer({ items: mockItems }, updateQuantity(updateItem))
    mockItems = [
      { productId: '1', quantity: 10 },
      { productId: '2', quantity: 3 }
    ]
    expect(state.items).toEqual(mockItems)
  })
  test('updateQuantity: should not update non-existing item', () => {
    const updateItem = { productId: '3', quantity: 3 }
    const state = cartReducer({ items: mockItems }, updateQuantity(updateItem))
    expect(state.items).toEqual(mockItems)
  })
  test('removeItem: should remove item', () => {
    const itemId = '1'
    const state = cartReducer({ items: mockItems }, removeItem(itemId))
    mockItems = [{ productId: '2', quantity: 2 }]
    expect(state.items).toEqual(mockItems)
  })
  test('removeItem: should not remove unfound item', () => {
    const itemId = '3'
    const state = cartReducer({ items: mockItems }, removeItem(itemId))
    expect(state.items).toEqual(mockItems)
  })
  test('clearCart: should clear cart', () => {
    const state = cartReducer({ items: mockItems }, clearCart())
    expect(state.items).toEqual([])
  })
})
