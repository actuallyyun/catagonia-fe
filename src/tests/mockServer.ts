import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

import {
  Product,
  CreateProductRequest,
  UserAuthToken,
  UserLoginRequest,
  UserInfo
} from '../misc/type'
import { isTypeAliasDeclaration } from 'typescript'

export const mockAuthToken: UserAuthToken = {
  access_token: 'access',
  refresh_token: 'refresh'
}

export const mockRefreshedAuthToken: UserAuthToken = {
  access_token: 'access access',
  refresh_token: 'refresh'
}

export const mockAuthHeader = {
  Authorization: 'Bearer access'
}
export const mockUserInfo: UserInfo = {
  id: 1,
  name: 'user1',
  email: 'user1@gmail.com',
  role: 'customer',
  avatar: 'img'
}

export const mockUserRes = {
  id: 1,
  name: 'user1',
  email: 'user1@gmail.com',
  role: 'customer',
  avatar: 'img',
  password: ''
}

export const userLoginRequest: UserLoginRequest = {
  email: mockUserInfo.email,
  password: 'user1password'
}
export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'product1',
    price: 1,
    description: 'product1',
    images: ['img1', 'img2'],
    category: {
      id: 1,
      name: 'cloth',
      image: 'img',
      creationAt: '2024',
      updatedAt: '2024'
    },
    creationAt: '2024',
    updatedAt: '2024'
  },
  {
    id: 2,
    title: 'product2',
    price: 2,
    description: 'product2',
    images: ['img1', 'img2'],
    category: {
      id: 2,
      name: 'cloth',
      image: 'img',
      creationAt: '2024',
      updatedAt: '2024'
    },
    creationAt: '2024',
    updatedAt: '2024'
  },
  {
    id: 3,
    title: 'product2',
    price: 2,
    description: 'product2',
    images: ['img1', 'img2'],
    category: {
      id: 3,
      name: 'cloth',
      image: 'img',
      creationAt: '2024',
      updatedAt: '2024'
    },
    creationAt: '2024',
    updatedAt: '2024'
  }
]

const mockCategories = [
  {
    id: 1,
    name: 'Clothes',
    image: 'https://i.imgur.com/QkIa5tT.jpeg'
  },
  {
    id: 2,
    name: 'Electronics',
    image: 'https://i.imgur.com/ZANVnHE.jpeg'
  },
  {
    id: 3,
    name: 'Furniture',
    image: 'https://i.imgur.com/Qphac99.jpeg'
  }
]

export const handler = [
  http.get('https://api.escuelajs.co/api/v1/products', () => {
    return HttpResponse.json(mockProducts, { status: 200 })
  }),
  http.get('https://api.escuelajs.co/api/v1/categories', () => {
    return HttpResponse.json(mockCategories)
  }),
  http.get(
    'https://api.escuelajs.co/api/v1/products/:id',
    ({ request, params }) => {
      const productId = Number(params.id)
      if (productId) {
        const product = mockProducts.find((_p) => _p.id === productId)
        return HttpResponse.json(product)
      } else {
        return new HttpResponse(null, { status: 404 })
      }
    }
  ),
  http.post(
    'https://api.escuelajs.co/api/v1/auth/login',
    async ({ request }) => {
      const userReq = (await request.json()) as UserLoginRequest | null
      if (!userReq) {
        return new HttpResponse(null, { status: 400 })
      }
      if (
        userReq?.email === userLoginRequest.email &&
        userReq?.password === userLoginRequest.password
      ) {
        return HttpResponse.json(mockAuthToken, { status: 200 })
      }
      return new HttpResponse(null, { status: 400 })
    }
  ),
  http.get('https://api.escuelajs.co/api/v1/auth/profile', ({ request }) => {
    if (!request.headers.has('Authorization')) {
      throw new HttpResponse(null, { status: 400 })
    } else {
      if (request.headers.get('Authorization') === 'Bearer access') {
        return HttpResponse.json(mockUserRes, { status: 200 })
      } else {
        throw new HttpResponse(null, { status: 400 })
      }
    }
  }),
  http.post(
    'https://api.escuelajs.co/api/v1/auth/refresh-token',
    async ({ request }) => {
      const token = (await request.json()) as { refreshToken: string } | null
      if (!token) {
        throw new HttpResponse(null, { status: 400 })
      } else {
        if (token['refreshToken'] === 'refresh') {
          return HttpResponse.json(mockRefreshedAuthToken)
        }
      }
      return new HttpResponse(null, { status: 400 })
    }
  )
  //http.post('https://api.escuelajs.co/api/v1/products', async ({ request }) => {
  //  const product = (await request.json()) as CreateProductRequest
  //  const createdProduct: Partial<Product> = {
  //    ...product,
  //    id: 3
  //  }
  //  return HttpResponse.json(createdProduct, { status: 201 })
  //}),
  //http.get(
  //  `https://api.escuelajs.co/api/v1/categories/:id/products`,
  //  ({ params }) => {
  //    const id = params
  //    console.log('fetching category with id' + id)
  //  }
  //)
]

export const mockServer = setupServer(...handler)