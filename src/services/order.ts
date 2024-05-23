import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  Category,
  Product,
  UpdateProductRequest,
  QueryParams,
  CreateProductRequest,
  ReviewReadDto
} from '../misc/type'
import { API_URL, constructQueryUrl } from '../misc/utils'

const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ['Addresses'],
  endpoints: (builder) => ({
    getAllUserAddresses: builder.query<Product[], QueryParams | null>({
      query: (param) => ({
        url: `/users/addresses`,
        method: 'GET'
      }),
      providesTags: [{ type: 'Addresses' }]
    })
  })
})
