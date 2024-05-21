import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category } from '../../misc/type'
import fakeStoreApi from '../../services/product'
import { AppState } from '../../app/store'

export type InitialState = {
  sortBy: string
  categories: Category[] | null
}

const initialState: InitialState = {
  sortBy: 'default',
  categories: null
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setSortMethod: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        sortBy: action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      fakeStoreApi.endpoints.getCategories.matchFulfilled,
      (state, { payload }) => {
        state.categories = payload
      }
    )
  }
})

export const categoryReducer = categorySlice.reducer
export const { setSortMethod } = categorySlice.actions

export const selectAllCategories = (state: AppState) =>
  state.category.categories

export const selectCategoryById = (state: AppState, id: string) =>
  state.category.categories
    ? state.category?.categories.filter((_cat) => _cat.id === id)
    : null