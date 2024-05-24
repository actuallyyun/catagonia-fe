import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { AppState } from '../app/store'
import {
  Category,
  Product,
  UpdateProductRequest,
  QueryParams,
  CreateProductRequest,
  ReviewReadDto
} from '../misc/type'
import { API_URL, constructQueryUrl } from '../misc/utils'

const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as AppState).user.token?.accessToken
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    }
  }),

  tagTypes: ['Products', 'Product', 'Category', 'Review'],
  endpoints: (builder) => ({
    getAllProducts: builder.query<Product[], QueryParams | null>({
      query: (param) => ({
        url: `/products?${constructQueryUrl(param)}`,
        method: 'GET'
      }),
      providesTags: [{ type: 'Products' }]
    }),
    getSingleProduct: builder.query<Product, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => [{ type: 'Product', id: arg }]
    }),
    updateProduct: builder.mutation<Product, UpdateProductRequest>({
      query: (request) => ({
        url: `/products/${request.id}`,
        method: 'PUT',
        body: request
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg.id }]
    }),
    deleteProduct: builder.mutation<Boolean, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Product', id: arg }]
    }),
    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (product) => ({
        url: '/products/',
        method: 'POST',
        body: product
      }),
      invalidatesTags: [{ type: 'Products' }]
    }),
    getReviewsByProduct: builder.query({
      query: (productId: string) => ({
        url: `/products/${productId}/reviews/`,
        method: 'GET'
      }),
      providesTags: ['Review'],
      transformResponse: (response: ReviewReadDto[], meta, arg) =>
        response.sort(
          (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
        )
    }),

    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      transformResponse: (response: Category[], meta, arg) => response
    }),
    getSingleCategory: builder.query<Category, string>({
      query: (catId) => ({
        url: `/categories/${catId}`,
        method: 'GET'
      }),
      providesTags: (result, error, arg) => [{ type: 'Category', id: arg }]
    }),
    getProductsByCategory: builder.query({
      query: ({
        categoryId,
        sortBy
      }: {
        categoryId: string
        sortBy: string
      }) => ({
        url: `/categories/${categoryId}/products/`,
        method: 'GET'
      }),
      providesTags: ['Category'],
      transformResponse: (response: Product[], meta, arg) => {
        if (arg.sortBy === 'ascending') {
          return response.sort((a, b) => a.price - b.price)
        }
        if (arg.sortBy === 'descending') {
          return response.sort((a, b) => b.price - a.price)
        }
        if (arg.sortBy === 'newest') {
          return response.sort(
            (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
          )
        }
        return response
      }
    })
  })
})

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useGetSingleCategoryQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetReviewsByProductQuery
} = productApi
export default productApi
