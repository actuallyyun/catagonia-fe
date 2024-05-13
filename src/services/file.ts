import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { FileResponse } from '../misc/type'
import { API_URL } from '../misc/utils'

const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL
  }),
  endpoints: (builder) => ({
    uploadFile: builder.mutation<FileResponse, File>({
      query: (imgFile) => {
        const bodyFormData = new FormData()
        bodyFormData.append('file', imgFile)
        return {
          url: '/files/upload/',
          method: 'POST',
          body: bodyFormData,
          formData: true
        }
      }
    })
  })
})

export const { useUploadFileMutation } = fileApi
export default fileApi
