import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Category,
  Product,
  UpdateProductRequest,
  QueryParams,
  CreateProductRequest
} from '../misc/type'
import { API_URL, constructQueryUrl } from '../misc/utils'

const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Products', 'Product', 'Category'],
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
        body: {
          title: request.title,
          price: request.price
        }
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

    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/categories', method: 'GET' }),
      transformResponse: (response: Category[], meta, arg) =>
        response.slice(0, 5)
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
            (a, b) => Date.parse(a.creationAt) - Date.parse(b.creationAt)
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
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery
} = productApi
export default productApi
