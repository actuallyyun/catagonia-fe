import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CartItem } from '../../misc/type'
import { AppState } from '../../app/store'

export type InitialState = {
  items: CartItem[]
}

const cartInStorage = localStorage.getItem('cart')

const initialState: InitialState = {
  items: cartInStorage ? JSON.parse(cartInStorage) : []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload
      const itemIndex = state.items
        ? state.items.findIndex(
            (_item) => _item.productId === newItem.productId
          )
        : -1
      // if not found, add new item
      if (itemIndex === -1) {
        state.items.push(newItem)
        localStorage.setItem('cart', JSON.stringify(state.items))
      } else {
        //if found, update quantity
        const newCart = state.items.map((prevItem, index) => {
          if (index === itemIndex) {
            return {
              ...prevItem,
              quantity: prevItem.quantity + newItem.quantity
            }
          } else {
            return prevItem
          }
        })
        state.items = newCart
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
    },
    updateQuantity: (state, action: PayloadAction<CartItem>) => {
      const updateItem = action.payload
      const itemIndex = state.items
        ? state.items.findIndex(
            (_item) => _item.productId === updateItem.productId
          )
        : -1
      // if found, update quantity
      if (itemIndex !== -1) {
        // update quantity
        const newCart = state.items.map((prevItem, index) => {
          if (index === itemIndex) {
            return {
              ...prevItem,
              quantity: updateItem.quantity
            }
          } else {
            return prevItem
          }
        })
        state.items = newCart
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const itemIndex = state.items
        ? state.items.findIndex((_item) => _item.productId === action.payload)
        : -1
      // if found, remove
      if (itemIndex !== -1) {
        const newCart = state.items.filter(
          (prevItem) => prevItem.productId !== action.payload
        )
        state.items = newCart
        localStorage.setItem('cart', JSON.stringify(newCart))
      }
    },
    clearCart: (state) => {
      state.items = []
      localStorage.removeItem('cart')
    }
  }
})

const cartReducer = cartSlice.reducer
export const { addItem, removeItem, clearCart, updateQuantity } =
  cartSlice.actions

export default cartReducer

export const selectAllItems = (state: AppState) => state.cart.items
